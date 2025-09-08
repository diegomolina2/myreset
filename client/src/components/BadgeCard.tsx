import React from 'react';
import { Badge as BadgeType } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Lock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface BadgeCardProps {
  badge: BadgeType;
  showDate?: boolean;
}

export function BadgeCard({ badge, showDate = false }: BadgeCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
    <Card className={`w-full text-center transition-all duration-300 ${
      badge.isUnlocked 
        ? 'shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900' 
        : 'shadow-sm bg-gray-50 dark:bg-gray-900 opacity-60'
    }`}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          {/* Badge Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
            badge.isUnlocked 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : 'bg-gray-300 dark:bg-gray-700'
          }`}>
            {badge.isUnlocked ? getBadgeIcon(badge.id) : <Lock className="w-8 h-8 text-gray-500" />}
          </div>

          {/* Badge Info */}
          <div className="space-y-1">
            <h3 className="font-poppins font-bold text-sm text-gray-800 dark:text-gray-100">
              {t(`badges.badgeTypes.${badge.id}`) || badge.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
          </div>

          {/* Status Badge */}
          <Badge 
            variant={badge.isUnlocked ? 'default' : 'secondary'}
            className={`text-xs ${
              badge.isUnlocked 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {badge.isUnlocked ? t('badges.unlocked') : t('badges.locked')}
          </Badge>

          {/* Unlock Date */}
          {badge.isUnlocked && badge.unlockedAt && showDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('badges.unlockedAt', { date: formatDate(badge.unlockedAt) })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
