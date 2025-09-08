
import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Star, Sparkles, X, CheckCircle } from 'lucide-react';

interface ChallengeCompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  currentDay: number;
  totalDays: number;
}

export function ChallengeCompletionPopup({ 
  isOpen, 
  onClose, 
  challengeName, 
  currentDay, 
  totalDays 
}: ChallengeCompletionPopupProps) {
  const isLastDay = currentDay === totalDays;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Animated Trophy Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center animate-bounce">
              {isLastDay ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <CheckCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Celebration Text */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {isLastDay ? "Desafio Concluído! 🎉" : "Dia Concluído! 🎯"}
              </h2>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {isLastDay 
                ? "Parabéns! Você completou todo o desafio!"
                : "Excelente! Você completou mais um dia!"
              }
            </p>
          </div>

          {/* Challenge Details */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {challengeName}
            </h3>
            
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                Dia {currentDay} de {totalDays}
              </Badge>
              
              {isLastDay && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  <Trophy className="w-3 h-3 mr-1" />
                  Desafio Completo
                </Badge>
              )}
            </div>

            {!isLastDay && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue assim! Faltam {totalDays - currentDay} dias.
              </p>
            )}
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className={`w-full font-semibold ${
              isLastDay 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
            }`}
          >
            {isLastDay 
              ? "Incrível! Vamos para o próximo! 🚀"
              : "Continue assim! 💪"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
