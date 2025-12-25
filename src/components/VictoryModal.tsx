import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

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
      <DialogContent className="bg-card border-border max-w-sm mx-4 p-0 overflow-hidden rounded-xl">
        <div className="p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <span className="text-4xl mb-2 block">{isLoss ? '😔' : '🎉'}</span>
            <h2 className="text-xl font-display font-bold text-foreground">
              {isLoss ? 'Boa Sorte!' : 'Parabéns!'}
            </h2>
          </div>

          {isLoss ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Não foi desta vez, mas tente novamente!
              </p>
              <Button
                onClick={onClose}
                variant="secondary"
                className="w-full py-2.5 font-display font-semibold"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Você acabou de ganhar
                </p>
                <div className="py-2 px-3 rounded-lg bg-primary/15 inline-block">
                  <span className="text-lg font-display font-bold text-primary">
                    {prizeName}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Para reivindicar, siga os passos:
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Clique em <strong>Resgatar</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Crie a sua conta no site oficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Faça depósito mínimo de <strong className="text-gold">20MT</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground">Pronto! Receba sua recompensa 🎁</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={onRedeem}
                variant="hero"
                size="lg"
                className="w-full"
              >
                🔥 Resgatar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
