
import React from 'react';
import { Badge as BadgeType } from '../types';
import { Dialog, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';
import { Star, Trophy, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from '../hooks/useTranslation';

interface BadgeNotificationProps {
  badge: BadgeType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeNotification({ badge, isOpen, onClose }: BadgeNotificationProps) {
  const { t } = useTranslation();

  if (!badge) return null;

  const getBadgeIcon = (badgeId: string) => {
    const iconMap: Record<string, string> = {
      'first_step': '🏃‍♂️',
      'hydrated': '💧',
      'consistent': '⚡',
      'no_sugar_hero': '🍎',
      'halfway': '🎯',
      'week_warrior': '🏆',
      'month_master': '👑',
      'exercise_enthusiast': '💪',
      'healthy_eater': '🥗',
      'water_champion': '🌊'
    };
    
    return iconMap[badgeId] || '🏅';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Animated Badge Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl animate-bounce">
              {getBadgeIcon(badge.id)}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Celebration Text */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Parabéns! 🎉
              </h2>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Você desbloqueou uma nova conquista!
            </p>
          </div>

          {/* Badge Details */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {t(`badges.badgeTypes.${badge.id}`) || badge.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
            
            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              <Star className="w-3 h-3 mr-1" />
              Conquista Desbloqueada
            </Badge>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
          >
            Incrível! Continue assim! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
