
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Play, Heart, Info, Timer, Pause, RotateCcw, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { hasAccessToContent } from '../utils/planManager';

interface Exercise {
  id: string;
  name: string | { [key: string]: string };
  category: string;
  duration?: string;
  reps?: string;
  rest?: string;
  description: string | { [key: string]: string };
  instructions: string | { [key: string]: string };
  media?: string;
  accessPlans?: number[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: () => void;
}

export function ExerciseCard({ exercise, onStart }: ExerciseCardProps) {
  const { state, toggleFavorite } = useApp();
  const { getLocalizedText, language } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'prep' | 'exercise' | 'rest'>('prep');
  const [prepTimer, setPrepTimer] = useState(10);

  const isFavorite = state.userData.favorites.exercises.includes(exercise.id);
  const hasAccess = hasAccessToContent(exercise);
  
  const exerciseName = typeof exercise.name === 'string' 
    ? exercise.name 
    : exercise.name && typeof exercise.name === 'object' 
      ? getLocalizedText(exercise.name) 
      : '';

  const exerciseDescription = typeof exercise.description === 'string'
    ? exercise.description
    : exercise.description && typeof exercise.description === 'object'
      ? getLocalizedText(exercise.description)
      : '';

  const exerciseInstructions = typeof exercise.instructions === 'string'
    ? exercise.instructions
    : exercise.instructions && typeof exercise.instructions === 'object'
      ? getLocalizedText(exercise.instructions)
      : '';
  
  // Convert duration to seconds for timer
  const getDurationInSeconds = () => {
    if (!exercise.duration) return 60; // default 1 minute
    const match = exercise.duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 60;
  };

  const getRestInSeconds = () => {
    if (!exercise.rest) return 30; // default 30 seconds
    const match = exercise.rest.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const handleStartTimer = () => {
    setPrepTimer(10);
    setCurrentPhase('prep');
    setShowTimer(true);
    setIsRunning(true);
    
    // Start preparation countdown
    const prepInterval = setInterval(() => {
      setPrepTimer((prev) => {
        if (prev <= 1) {
          clearInterval(prepInterval);
          // Start main exercise
          setCurrentPhase('exercise');
          setTimer(getDurationInSeconds());
          startExerciseTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(prepInterval);
  };

  const startExerciseTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Start rest period
          setCurrentPhase('rest');
          setTimer(getRestInSeconds());
          startRestTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const startRestTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setShowTimer(false);
          setCurrentPhase('prep');
          onStart(); // Call the original onStart function
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const handlePauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(!isRunning);
    
    if (!isRunning) {
      if (currentPhase === 'prep') {
        const prepInterval = setInterval(() => {
          setPrepTimer((prev) => {
            if (prev <= 1) {
              clearInterval(prepInterval);
              setCurrentPhase('exercise');
              setTimer(getDurationInSeconds());
              startExerciseTimer();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimerInterval(prepInterval);
      } else if (currentPhase === 'exercise') {
        startExerciseTimer();
      } else {
        startRestTimer();
      }
    }
  };

  const handleResetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setPrepTimer(10);
    setTimer(getDurationInSeconds());
    setCurrentPhase('prep');
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = () => {
    switch (exercise.category) {
      case 'Light': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Moderate': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'prep': return 'Preparação';
      case 'exercise': return 'Exercício';
      case 'rest': return 'Descanso';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'prep': return 'text-yellow-500';
      case 'exercise': return 'text-green-500';
      case 'rest': return 'text-blue-500';
    }
  };

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${!hasAccess ? 'opacity-75' : 'hover:scale-[1.01]'}`}>
        {/* Category Badge */}
        <div className="relative p-4 pb-2">
          <div className="flex justify-between items-start mb-3">
            <Badge className={`${getCategoryColor()}`}>
              {exercise.category}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite('exercises', exercise.id)}
              className="h-8 w-8 p-0"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
          </div>

          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {exerciseName}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {exerciseDescription}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {exercise.duration && (
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Timer className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Duração</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {exercise.duration}
                  </p>
                </div>
              )}
              
              {exercise.reps && (
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Star className="w-4 h-4 mx-auto mb-1 text-green-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Repetições</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {exercise.reps}
                  </p>
                </div>
              )}
              
              {exercise.rest && (
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Pause className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Descanso</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {exercise.rest}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleStartTimer}
                disabled={!hasAccess}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Exercício
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="flex-shrink-0"
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Exercise Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{exerciseName}</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o exercício
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Exercise GIF */}
            {exercise.media && (
              <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={exercise.media} 
                  alt={exerciseName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Exercise Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
                <p className="font-semibold">{exercise.category}</p>
              </div>
              
              {exercise.duration && (
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                  <p className="font-semibold">{exercise.duration}</p>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Descrição:</h4>
              <p className="text-gray-600 dark:text-gray-400">{exerciseDescription}</p>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold mb-2">Instruções:</h4>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {exerciseInstructions}
              </div>
            </div>
            
            <Button
              onClick={() => {
                setShowDetails(false);
                handleStartTimer();
              }}
              disabled={!hasAccess}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Exercício
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timer Dialog */}
      <Dialog open={showTimer} onOpenChange={setShowTimer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{exerciseName}</DialogTitle>
            <DialogDescription className="text-center">
              <span className={`font-semibold ${getPhaseColor()}`}>
                {getPhaseText()}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center space-y-6">
            {/* Exercise GIF */}
            {exercise.media && currentPhase !== 'prep' && (
              <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={exercise.media} 
                  alt={exerciseName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Preparation Phase */}
            {currentPhase === 'prep' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl">🏃‍♂️</div>
                <p className="text-lg font-semibold">Prepare-se!</p>
                <div className="text-4xl font-bold text-yellow-500">
                  {prepTimer}
                </div>
              </div>
            )}
            
            {/* Timer Display for Exercise/Rest */}
            {currentPhase !== 'prep' && (
              <div className="relative">
                <div className="w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={currentPhase === 'exercise' ? 'text-green-500' : 'text-blue-500'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(timer / (currentPhase === 'exercise' ? getDurationInSeconds() : getRestInSeconds())) * 100}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {formatTime(timer)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Timer Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handlePauseTimer}
                variant="outline"
                size="sm"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={handleResetTimer}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
