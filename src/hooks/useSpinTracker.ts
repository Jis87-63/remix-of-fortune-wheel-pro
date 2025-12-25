import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vodacom_spin_data';
const COOLDOWN_HOURS = 24;

interface SpinData {
  deviceId: string;
  spinCount: number;
  lastSpinTime: number;
  bonusSpins: number;
}

// Gera ID único do navegador/dispositivo
const generateDeviceId = (): string => {
  const existingId = localStorage.getItem('vodacom_device_id');
  if (existingId) return existingId;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let fingerprint = '';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Vodacom', 2, 2);
    fingerprint = canvas.toDataURL();
  }

  const navigatorData = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    fingerprint
  ].join('|');

  let hash = 0;
  for (let i = 0; i < navigatorData.length; i++) {
    const char = navigatorData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const deviceId = 'vod_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
  localStorage.setItem('vodacom_device_id', deviceId);
  
  return deviceId;
};

const getSpinData = (deviceId: string): SpinData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as SpinData;
      if (data.deviceId === deviceId) {
        return data;
      }
    }
  } catch (e) {
    console.error('Error reading spin data:', e);
  }
  
  return {
    deviceId,
    spinCount: 0,
    lastSpinTime: 0,
    bonusSpins: 0
  };
};

const saveSpinData = (data: SpinData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving spin data:', e);
  }
};

export const useSpinTracker = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [spinCount, setSpinCount] = useState(0);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [cooldownEnd, setCooldownEnd] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa os dados
  useEffect(() => {
    const id = generateDeviceId();
    setDeviceId(id);
    
    const data = getSpinData(id);
    
    // Verifica se o cooldown passou (24h)
    const now = Date.now();
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
    
    if (data.spinCount >= 2 && data.lastSpinTime > 0) {
      const cooldownEndTime = data.lastSpinTime + cooldownMs;
      
      if (now >= cooldownEndTime) {
        // Cooldown passou, reset os giros
        const newData: SpinData = {
          ...data,
          spinCount: 0,
          lastSpinTime: 0
        };
        saveSpinData(newData);
        setSpinCount(0);
        setCooldownEnd(0);
      } else {
        setSpinCount(data.spinCount);
        setCooldownEnd(cooldownEndTime);
      }
    } else {
      setSpinCount(data.spinCount);
    }
    
    setBonusSpins(data.bonusSpins);
    setIsLoading(false);
  }, []);

  // Registra um giro
  const recordSpin = useCallback(() => {
    const newSpinCount = spinCount + 1;
    const now = Date.now();
    
    const data: SpinData = {
      deviceId,
      spinCount: newSpinCount,
      lastSpinTime: now,
      bonusSpins
    };
    
    saveSpinData(data);
    setSpinCount(newSpinCount);
    
    if (newSpinCount >= 2) {
      setCooldownEnd(now + COOLDOWN_HOURS * 60 * 60 * 1000);
    }
    
    return newSpinCount;
  }, [deviceId, spinCount, bonusSpins]);

  // Adiciona giros bônus (de compartilhamentos)
  const addBonusSpins = useCallback((amount: number = 2) => {
    const data = getSpinData(deviceId);
    const newData: SpinData = {
      ...data,
      spinCount: 0, // Reset spin count
      lastSpinTime: 0,
      bonusSpins: data.bonusSpins + 1
    };
    
    saveSpinData(newData);
    setSpinCount(0);
    setBonusSpins(newData.bonusSpins);
    setCooldownEnd(0);
  }, [deviceId]);

  // Calcula giros restantes
  const remainingSpins = Math.max(0, 2 - spinCount);
  
  // Verifica se está em cooldown
  const isInCooldown = cooldownEnd > Date.now() && remainingSpins === 0;
  
  // Tempo restante de cooldown em horas
  const cooldownHoursLeft = isInCooldown 
    ? Math.ceil((cooldownEnd - Date.now()) / (60 * 60 * 1000))
    : 0;

  return {
    deviceId,
    spinCount,
    remainingSpins,
    isInCooldown,
    cooldownHoursLeft,
    bonusSpins,
    recordSpin,
    addBonusSpins,
    isLoading
  };
};
