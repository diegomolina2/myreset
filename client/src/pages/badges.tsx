
import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Award, Lock, Star, Trophy, Target, Zap, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { BadgeCard } from '../components/BadgeCard';

// Predefined badge system
const AVAILABLE_BADGES = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your first day of any challenge',
    icon: '🏃‍♂️',
    category: 'milestone',
    requirement: 'Complete day 1 of any challenge'
  },
  {
    id: 'hydrated',
    name: 'Hydrated',
    description: 'Hit water goal for 7 consecutive days',
    icon: '💧',
    category: 'consistency',
    requirement: 'Log water intake for 7 days in a row'
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Maintained a 7-day activity streak',
    icon: '⚡',
    category: 'consistency',
    requirement: 'Complete any activity for 7 days straight'
  },
  {
    id: 'no_sugar_hero',
    name: 'No Sugar Hero',
    description: 'Completed the 30-day no sugar challenge',
    icon: '🍎',
    category: 'challenge',
    requirement: 'Complete the 30-Day No Sugar challenge'
  },
  {
    id: 'halfway',
    name: 'Halfway',
    description: 'Reached 50% completion of any challenge',
    icon: '🎯',
    category: 'milestone',
    requirement: 'Complete 50% of any challenge'
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Completed a full week challenge',
    icon: '🏆',
    category: 'challenge',
    requirement: 'Complete any 7-day challenge'
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Completed a month-long challenge',
    icon: '👑',
    category: 'challenge',
    requirement: 'Complete any 30-day challenge'
  },
  {
    id: 'exercise_enthusiast',
    name: 'Exercise Enthusiast',
    description: 'Completed 20 different exercises',
    icon: '💪',
    category: 'activity',
    requirement: 'Try 20 different exercises'
  },
  {
    id: 'healthy_eater',
    name: 'Healthy Eater',
    description: 'Logged meals for 14 consecutive days',
    icon: '🥗',
    category: 'nutrition',
    requirement: 'Log meals for 14 days in a row'
  },
  {
    id: 'water_champion',
    name: 'Water Champion',
    description: 'Hit daily water goal for 30 days',
    icon: '🌊',
    category: 'consistency',
    requirement: 'Meet water intake goal for 30 days'
  }
];

export default function Badges() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { userData } = state;
  
  // Create badge objects with unlock status
  const allBadges = AVAILABLE_BADGES.map(badge => {
    const unlockedBadge = userData.badges.find(b => b.id === badge.id);
    return {
      ...badge,
      isUnlocked: !!unlockedBadge,
      unlockedAt: unlockedBadge?.unlockedAt
    };
  });

  const unlockedBadges = allBadges.filter(badge => badge.isUnlocked);
  const lockedBadges = allBadges.filter(badge => !badge.isUnlocked);

  const categories = ['all', 'milestone', 'consistency', 'challenge', 'activity', 'nutrition'];
  
  const filteredBadges = allBadges.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'consistency': return <Zap className="w-4 h-4" />;
      case 'challenge': return <Trophy className="w-4 h-4" />;
      case 'activity': return <Star className="w-4 h-4" />;
      case 'nutrition': return <Award className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'consistency': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'challenge': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'activity': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'nutrition': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const BadgeStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-8 h-8 mr-2" />
            <div className="text-3xl font-bold">{unlockedBadges.length}</div>
          </div>
          <div className="text-green-100 font-medium">Conquistadas</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 mr-2" />
            <div className="text-3xl font-bold">{lockedBadges.length}</div>
          </div>
          <div className="text-gray-100 font-medium">Bloqueadas</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 mr-2" />
            <div className="text-3xl font-bold">{allBadges.length}</div>
          </div>
          <div className="text-blue-100 font-medium">Total</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                {t('badges.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Celebre suas conquistas na jornada de bem-estar
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round((unlockedBadges.length / allBadges.length) * 100)}%</div>
              <div className="text-xs text-gray-500">Progresso</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <BadgeStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Todas ({allBadges.length})</span>
            </TabsTrigger>
            <TabsTrigger value="unlocked" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Conquistadas ({unlockedBadges.length})</span>
            </TabsTrigger>
            <TabsTrigger value="locked" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Bloqueadas ({lockedBadges.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {category !== 'all' && getCategoryIcon(category)}
                  <span>
                    {category === 'all' ? 'Todas' : 
                     category === 'milestone' ? 'Marcos' :
                     category === 'consistency' ? 'Consistência' :
                     category === 'challenge' ? 'Desafios' :
                     category === 'activity' ? 'Atividades' :
                     category === 'nutrition' ? 'Nutrição' : category}
                  </span>
                  <Badge variant="secondary" className="ml-1">
                    {category === 'all' ? allBadges.length : allBadges.filter(b => b.category === category).length}
                  </Badge>
                </button>
              ))}
            </div>

            {filteredBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBadges.map((badge) => (
                  <div key={badge.id} className="relative group">
                    <div className={`absolute -top-2 -right-2 z-10 ${getCategoryColor(badge.category)} px-2 py-1 rounded-full text-xs flex items-center space-x-1 transition-opacity ${badge.isUnlocked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {getCategoryIcon(badge.category)}
                    </div>
                    <BadgeCard badge={badge} showDate={true} />
                    {!badge.isUnlocked && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                          {badge.requirement}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed border-2 border-gray-300 dark:border-gray-600">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  Nenhuma badge encontrada
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Tente ajustar seus filtros de busca
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unlocked" className="mt-6">
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {unlockedBadges.map((badge) => (
                  <div key={badge.id} className="relative">
                    <div className={`absolute -top-2 -right-2 z-10 ${getCategoryColor(badge.category)} px-2 py-1 rounded-full text-xs flex items-center space-x-1`}>
                      {getCategoryIcon(badge.category)}
                    </div>
                    <BadgeCard badge={badge} showDate={true} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  Nenhuma badge conquistada ainda
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Complete atividades e desafios para conquistar sua primeira badge!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            {lockedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {lockedBadges.map((badge) => (
                  <div key={badge.id} className="relative group">
                    <div className={`absolute -top-2 -right-2 z-10 ${getCategoryColor(badge.category)} px-2 py-1 rounded-full text-xs flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {getCategoryIcon(badge.category)}
                    </div>
                    <BadgeCard badge={badge} />
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                        {badge.requirement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  Parabéns! Você conquistou todas as badges disponíveis!
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Continue mantendo seus hábitos saudáveis
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
