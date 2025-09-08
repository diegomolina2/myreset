
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { activatePlan, PLANS } from '../utils/planManager';
import { Key, Check, X } from 'lucide-react';

interface PlanActivationProps {
  onActivation: () => void;
}

export const PlanActivation: React.FC<PlanActivationProps> = ({ onActivation }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivation = async () => {
    if (!selectedPlan || !password) {
      setError('Por favor, selecione um plano e digite a senha');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const planId = parseInt(selectedPlan);
      const success = activatePlan(planId, password);

      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onActivation();
        }, 1500);
      } else {
        setError('Senha incorreta para o plano selecionado');
      }
    } catch (error) {
      setError('Erro ao ativar plano. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPlan('');
    setPassword('');
    setError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Plano Ativado com Sucesso!
          </h3>
          <p className="text-sm text-gray-600">
            Redirecionando...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Ativar Plano
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="plan">Selecione o Plano</Label>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um plano" />
            </SelectTrigger>
            <SelectContent>
              {PLANS.map((plan) => (
                <SelectItem key={plan.id} value={plan.id.toString()}>
                  {plan.name} - {plan.duration === -1 ? 'Ilimitado' : `${plan.duration} dias`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="password">Senha do Plano</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha do plano"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <Button 
          onClick={handleActivation} 
          disabled={isLoading || !selectedPlan || !password}
          className="w-full"
        >
          {isLoading ? 'Ativando...' : 'Ativar Plano'}
        </Button>

        {selectedPlan && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">
              {PLANS.find(p => p.id.toString() === selectedPlan)?.name}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {PLANS.find(p => p.id.toString() === selectedPlan)?.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PlanActivationDialog: React.FC<PlanActivationProps> = ({ onActivation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActivation = () => {
    setIsOpen(false);
    onActivation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Key className="w-4 h-4 mr-2" />
          Ativar Plano
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ativação de Plano</DialogTitle>
        </DialogHeader>
        <PlanActivation onActivation={handleActivation} />
      </DialogContent>
    </Dialog>
  );
};
