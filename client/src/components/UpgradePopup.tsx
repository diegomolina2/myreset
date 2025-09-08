
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Crown, Clock, AlertTriangle } from 'lucide-react';
import { PlanActivationDialog } from './PlanActivation';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const UpgradePopup: React.FC<UpgradePopupProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Acesso Expirado
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-orange-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">
              Seu plano expirou!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Para continuar usando o aplicativo, faça upgrade para o Plano Ilimitado.
            </p>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Plano Ilimitado</h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Acesso completo sem limitações de tempo
              </p>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>• Todos os desafios disponíveis</li>
                <li>• Funcionalidades premium</li>
                <li>• Sem prazo de expiração</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>

            <div className="space-y-2">
              <PlanActivationDialog onActivation={onUpgrade} />
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full text-gray-600"
              >
                Sair do App
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
