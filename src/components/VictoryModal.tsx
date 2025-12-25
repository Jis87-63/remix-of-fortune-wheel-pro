import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, PartyPopper, ExternalLink } from 'lucide-react';

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
      <DialogContent className="bg-[#f2f2f7] border-0 max-w-[280px] mx-auto p-0 overflow-hidden rounded-[14px] shadow-2xl">
        {isLoss ? (
          // Modal de falha com chapéu de natal
          <div className="p-4 text-center">
            <div className="w-14 h-14 mx-auto mb-2 relative">
              {/* Chapéu de Natal */}
              <div className="absolute -top-2 -right-1 text-2xl">🎅</div>
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎄</span>
              </div>
            </div>
            
            <h2 className="text-[15px] font-semibold text-[#1c1c1e] mb-1">
              Quase lá! 🎁
            </h2>
            
            <p className="text-[13px] text-[#3c3c43]/60 mb-3 leading-snug">
              Tente novamente para ganhar <span className="font-semibold text-[#1c1c1e]">5.000 MT</span>!
            </p>

            <Button
              onClick={onClose}
              className="w-full h-[42px] bg-[#007aff] hover:bg-[#0056b3] text-white text-[14px] font-semibold rounded-[10px]"
            >
              🎰 Girar Novamente
            </Button>
          </div>
        ) : (
          // Modal de vitória
          <div className="p-4 text-center">
            <div className="w-14 h-14 mx-auto mb-2 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <PartyPopper className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-[15px] font-bold text-[#1c1c1e] mb-0.5">
              🎉 Parabéns!
            </h2>
            
            <p className="text-[12px] text-[#3c3c43]/60 mb-2">
              Você ganhou o prêmio especial
            </p>

            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-[10px] py-2.5 px-3 mb-3 shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-[20px] font-bold text-white">
                  {prizeName}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#3c3c43]/50 mb-2.5">
              Crie conta • Deposite 20 MT • Receba 🎁
            </p>

            <Button
              onClick={onRedeem}
              className="w-full h-[44px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-[15px] font-bold rounded-[10px] shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
