import React, { useState, useEffect } from 'react';
import { Challenge } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Play, ArrowRight, RotateCcw, Calendar, Target, Trophy } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ChallengeCompletionPopup } from './ChallengeCompletionPopup';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: () => void;
  onContinue?: () => void;
  onViewDetails?: () => void;
  onRestart?: () => void;
}

export function ChallengeCard({ challenge, onStart, onContinue, onViewDetails, onRestart }: ChallengeCardProps) {
  const { t, getLocalizedText } = useTranslation();
  const { completeTask, uncompleteTask } = useApp();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [prevCompletedTasks, setPrevCompletedTasks] = useState<number>(0);

  const progressPercentage = (challenge.completedDays.length / challenge.days) * 100;
  const currentDayTasks = challenge.dailyTasks.find(task => task.day === challenge.currentDay);
  const completedTasksCount = currentDayTasks?.completed.filter(Boolean).length || 0;
  const totalTasksCount = currentDayTasks?.tasks.length || 0;
  const allTasksCompleted = completedTasksCount === totalTasksCount && totalTasksCount > 0;

  // Check if all tasks were just completed
  useEffect(() => {
    if (allTasksCompleted && completedTasksCount > prevCompletedTasks) {
      setShowCompletionPopup(true);
    }
    setPrevCompletedTasks(completedTasksCount);
  }, [completedTasksCount, allTasksCompleted, prevCompletedTasks]);

  const handleTaskToggle = (taskIndex: number) => {
    if (currentDayTasks?.completed[taskIndex]) {
      uncompleteTask(challenge.id, challenge.currentDay, taskIndex);
    } else {
      completeTask(challenge.id, challenge.currentDay, taskIndex);
    }
  };

  const getChallengeStatusColor = () => {
    if (progressPercentage === 100) return 'from-yellow-400 to-orange-500';
    if (progressPercentage > 50) return 'from-green-400 to-blue-500';
    return 'from-blue-400 to-purple-500';
  };

  // Get localized challenge name and description
  const challengeName = getLocalizedText(challenge.name);
  const challengeDescription = getLocalizedText(challenge.description);

  return (
    <>
      <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${getChallengeStatusColor()}`} />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100">
                  {challengeName}
                </CardTitle>
                {progressPercentage === 100 && (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{t('challenges.dayOf', { current: challenge.currentDay, total: challenge.days })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{completedTasksCount}/{totalTasksCount} {t('challenges.tasks')}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200 dark:text-gray-700"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>

              <Badge className={`text-xs bg-gradient-to-r ${getChallengeStatusColor()} text-white`}>
                {progressPercentage === 100 ? t('challenges.completed') : challenge.isActive ? t('challenges.active') : t('challenges.available')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {challengeDescription}
          </p>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('challenges.challengeProgress')}</span>
                <span className="font-medium">{challenge.completedDays.length}/{challenge.days} {t('challenges.daysLabel')}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Daily Tasks */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                {t('challenges.todayTasks')}:
              </h4>
              {currentDayTasks?.tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTaskToggle(index)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                        currentDayTasks.completed[index]
                          ? 'bg-green-500 text-white hover:bg-green-600 scale-110'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      {currentDayTasks.completed[index] ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </button>
                    <span className={`text-sm transition-all duration-200 ${
                      currentDayTasks.completed[index] 
                        ? 'line-through text-gray-500 dark:text-gray-400' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {task}
                    </span>
                  </div>
                  {currentDayTasks.completed[index] && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      ✓ {t('challenges.done')}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {!challenge.isActive && onStart && (
                <Button onClick={onStart} className="flex-1 bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  {t('challenges.startChallenge')}
                </Button>
              )}

              {challenge.isActive && onContinue && (
                <Button onClick={onContinue} className="flex-1 bg-secondary hover:bg-secondary/90">
                  {t('challenges.continueChallenge')}
                </Button>
              )}

              {challenge.isActive && onRestart && (
                <Button onClick={onRestart} variant="outline" className="flex-shrink-0">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('challenges.restart')}
                </Button>
              )}

              {onViewDetails && (
                <Button onClick={onViewDetails} variant="outline" className="flex-1">
                  {t('challenges.viewDetails')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        {/* Completion Celebration Popup */}
        <ChallengeCompletionPopup
          isOpen={showCompletionPopup}
          onClose={() => setShowCompletionPopup(false)}
          challengeName={challengeName}
          currentDay={challenge.currentDay}
          totalDays={challenge.days}
        />
      </Card>
    </>
  );
}