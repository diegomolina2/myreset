import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Play, CheckCircle, Calendar, Target, Award, Lock, Trophy, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ChallengeCard } from '../components/ChallengeCard';
import challengesData from '../data/challenges.json';
import { hasAccessToChallenge, getCurrentPlan, isAccessExpired, hasAccessToContent } from '../utils/planManager';
import { UpgradePopup } from '../components/UpgradePopup';
import { PlanActivationDialog } from '../components/PlanActivation';

export default function Challenges() {
  const { t } = useTranslation();
  const { state, startChallenge, restartChallenge } = useApp();
  const [selectedTab, setSelectedTab] = useState('available');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [accessExpired, setAccessExpired] = useState(false);

  // Função auxiliar para garantir que a tradução retorne uma string, e não objeto
  // Caso receba objeto, pega a primeira string válida ou converte para JSON string para evitar erro React
  const safeTranslate = (key: string) => {
    const result = t(key);
    if (typeof result === 'string') return result;
    if (typeof result === 'object' && result !== null) {
      // Se for objeto, tenta pegar o valor da primeira chave (exemplo: 'en-NG')
      const firstKey = Object.keys(result)[0];
      if (firstKey && typeof result[firstKey] === 'string') return result[firstKey];
      // fallback para converter objeto em string
      return JSON.stringify(result);
    }
    return '';
  };

  useEffect(() => {
    const checkAccess = () => {
      const expired = isAccessExpired();
      setAccessExpired(expired);
      if (expired) {
        setShowUpgradePopup(true);
      }
    };

    checkAccess();
    const interval = setInterval(checkAccess, 60000);
    return () => clearInterval(interval);
  }, []);

  const { userData } = state;
  const activeChallenges = Object.values(userData.challenges).filter(c => c.isActive);
  const completedChallenges = Object.values(userData.challenges).filter(c => c.completedDays.length === c.days);
  const availableChallenges = challengesData.filter(c => !userData.challenges[c.id] || !userData.challenges[c.id].isActive);

  const currentPlan = getCurrentPlan();

  const handleStartChallenge = (challengeId: string) => {
    if (accessExpired) {
      setShowUpgradePopup(true);
      return;
    }

    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge && !hasAccessToContent(challenge)) {
      setShowUpgradePopup(true);
      return;
    }

    startChallenge(challengeId);
  };

  const handleRestartChallenge = (challengeId: string) => {
    restartChallenge(challengeId);
  };

  const ChallengeStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{activeChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{safeTranslate('activeChallengesLabel') || 'Ativos'}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{completedChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{safeTranslate('completedChallengesLabel') || 'Concluídos'}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{availableChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{safeTranslate('availableChallengesLabel') || 'Disponíveis'}</div>
        </CardContent>
      </Card>
    </div>
  );

  const AvailableChallengeCard = ({ challenge }: { challenge: any }) => {
    const hasAccess = hasAccessToContent(challenge);
    const isLocked = !hasAccess;

    return (
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${isLocked ? 'opacity-75' : 'hover:scale-[1.02]'}`}>
        <div className={`h-2 ${isLocked ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`} />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {/* Use safeTranslate caso o nome seja objeto multilíngue */}
                  {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
                </CardTitle>
                {isLocked && <Lock className="w-5 h-5 text-gray-500" />}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.days} {safeTranslate('daysLabel') || 'dias'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{safeTranslate('completeChallengeLabel') || 'Desafio Completo'}</span>
                </div>
              </div>
            </div>

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isLocked ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}
            >
              {isLocked ? <Lock className="w-8 h-8 text-gray-500" /> : <Target className="w-8 h-8 text-white" />}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}
          </p>

          <div className="space-y-3 mb-6">
            {/* Exemplo: dailyTasks pode ser array de objetos multilíngues */}
            {challenge.dailyTasks && challenge.dailyTasks.slice(0, 3).map((task: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {typeof task.tasks[0] === 'string' ? task.tasks[0] : safeTranslate(task.tasks[0])}
                </span>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => handleStartChallenge(challenge.id)}
            disabled={isLocked}
            variant={isLocked ? 'outline' : 'default'}
          >
            {safeTranslate('startChallengeButton') || 'Começar desafio'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ActiveChallengeCard = ({ challenge }: { challenge: any }) => {
    const progress = (challenge.completedDays.length / challenge.days) * 100;

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="h-2 bg-gradient-to-r from-green-400 to-teal-500" />

        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
          </CardTitle>

          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}
          </p>

          <Progress value={progress} className="mb-4" />

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{challenge.completedDays.length} / {challenge.days} {safeTranslate('daysCompletedLabel') || 'dias completados'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Button className="w-full" onClick={() => restartChallenge(challenge.id)}>
            {safeTranslate('restartChallengeButton') || 'Reiniciar desafio'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-8">{safeTranslate('challengesTitle') || 'Desafios'}</h1>

      <ChallengeStats />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="available">{safeTranslate('tabAvailable') || 'Disponíveis'}</TabsTrigger>
          <TabsTrigger value="active">{safeTranslate('tabActive') || 'Ativos'}</TabsTrigger>
          <TabsTrigger value="completed">{safeTranslate('tabCompleted') || 'Concluídos'}</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {availableChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{safeTranslate('noAvailableChallenges') || 'Nenhum desafio disponível no momento.'}</p>
          )}

          {availableChallenges.map(challenge => (
            <AvailableChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {activeChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{safeTranslate('noActiveChallenges') || 'Você não possui desafios ativos.'}</p>
          )}

          {activeChallenges.map(challenge => (
            <ActiveChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{safeTranslate('noCompletedChallenges') || 'Nenhum desafio concluído ainda.'}</p>
          )}

          {completedChallenges.map(challenge => (
            <Card key={challenge.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>
                  {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}</p>
                <Badge variant="secondary" className="mt-2">
                  {safeTranslate('completedBadge') || 'Concluído'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {showUpgradePopup && (
        <UpgradePopup
          open={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          message={safeTranslate('upgradeMessage') || 'Seu acesso expirou. Atualize seu plano para continuar.'}
          actionText={safeTranslate('upgradeAction') || 'Atualizar plano'}
          onAction={() => {
            setShowUpgradePopup(false);
            // Abrir modal de ativação ou navegação para upgrade
          }}
        />
      )}

      <PlanActivationDialog />
    </div>
  );
}
