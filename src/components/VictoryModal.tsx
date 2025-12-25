import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, CheckCircle, Wallet, UserPlus, PartyPopper, RefreshCw } from 'lucide-react';

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
      <DialogContent className="bg-[#f2f2f7] border-0 max-w-[320px] mx-auto p-0 overflow-hidden rounded-[14px] shadow-2xl">
        {isLoss ? (
          // Modal de falha - estilo iOS
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-[17px] font-semibold text-[#1c1c1e] mb-2">
              Quase lá!
            </h2>
            
            <p className="text-[15px] text-[#3c3c43]/60 mb-6 leading-relaxed">
              Você ainda tem mais uma chance de ganhar o prêmio especial de <span className="font-semibold text-[#1c1c1e]">5.000,00 MT</span>!
            </p>

            <Button
              onClick={onClose}
              className="w-full h-[50px] bg-[#007aff] hover:bg-[#0056b3] text-white text-[17px] font-semibold rounded-[12px] shadow-lg"
            >
              Girar Novamente
            </Button>
          </div>
        ) : (
          // Modal de vitória - estilo iOS
          <div className="p-6 text-center">
            {/* Ícone de celebração */}
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            
            {/* Título */}
            <h2 className="text-[20px] font-bold text-[#1c1c1e] mb-1">
              🎉 Parabéns!
            </h2>
            
            <p className="text-[15px] text-[#3c3c43]/60 mb-4">
              Você ganhou o prêmio especial
            </p>

            {/* Valor do prêmio */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-[12px] py-4 px-6 mb-5 shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-6 h-6 text-white" />
                <span className="text-[28px] font-bold text-white">
                  {prizeName}
                </span>
              </div>
            </div>

            {/* Passos para reivindicar */}
            <div className="bg-white rounded-[12px] p-4 mb-5 text-left shadow-sm">
              <p className="text-[13px] font-medium text-[#3c3c43]/60 mb-3 text-center">
                Para receber seu prêmio:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#007aff]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#007aff]" />
                  </div>
                  <span className="text-[14px] text-[#1c1c1e]">
                    Clique em <strong>Reivindicar</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#34c759]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-4 h-4 text-[#34c759]" />
                  </div>
                  <span className="text-[14px] text-[#1c1c1e]">
                    Crie sua conta no site oficial
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#ff9500]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-4 h-4 text-[#ff9500]" />
                  </div>
                  <span className="text-[14px] text-[#1c1c1e]">
                    Faça depósito mínimo de <strong className="text-[#ff9500]">20 MT</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#af52de]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-[#af52de]" />
                  </div>
                  <span className="text-[14px] text-[#1c1c1e]">
                    Receba sua recompensa! 🎁
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de reivindicar */}
            <Button
              onClick={onRedeem}
              className="w-full h-[54px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-[17px] font-bold rounded-[12px] shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gift className="w-5 h-5 mr-2" />
              Reivindicar Prêmio
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
