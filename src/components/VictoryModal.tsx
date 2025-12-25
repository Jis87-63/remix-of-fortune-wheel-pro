import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, PartyPopper, RefreshCw, ExternalLink } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizeName: string;
  isLoss: boolean;
  onRedeem: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  prizeName,
  isLoss,
  onRedeem,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#f2f2f7] border-0 max-w-[300px] mx-auto p-0 overflow-hidden rounded-[14px] shadow-2xl">
        {isLoss ? (
          // Modal de falha - estilo iOS compacto
          <div className="p-5 text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-[16px] font-semibold text-[#1c1c1e] mb-1.5">
              Quase lá!
            </h2>
            
            <p className="text-[14px] text-[#3c3c43]/60 mb-4 leading-snug">
              Tente novamente e ganhe <span className="font-semibold text-[#1c1c1e]">5.000 MT</span>!
            </p>

            <Button
              onClick={onClose}
              className="w-full h-[44px] bg-[#007aff] hover:bg-[#0056b3] text-white text-[15px] font-semibold rounded-[10px]"
            >
              Girar Novamente
            </Button>
          </div>
        ) : (
          // Modal de vitória - estilo iOS compacto
          <div className="p-5 text-center">
            {/* Ícone de celebração */}
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <PartyPopper className="w-8 h-8 text-white" />
            </div>
            
            {/* Título */}
            <h2 className="text-[17px] font-bold text-[#1c1c1e] mb-0.5">
              🎉 Parabéns!
            </h2>
            
            <p className="text-[13px] text-[#3c3c43]/60 mb-3">
              Você ganhou o prêmio especial
            </p>

            {/* Valor do prêmio */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-[10px] py-3 px-4 mb-4 shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-[24px] font-bold text-white">
                  {prizeName}
                </span>
              </div>
            </div>

            {/* Info compacta */}
            <p className="text-[12px] text-[#3c3c43]/50 mb-3">
              Crie conta • Deposite 20 MT • Receba 🎁
            </p>

            {/* Botão de reivindicar */}
            <Button
              onClick={onRedeem}
              className="w-full h-[48px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-[16px] font-bold rounded-[10px] shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Reivindicar Prêmio
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
