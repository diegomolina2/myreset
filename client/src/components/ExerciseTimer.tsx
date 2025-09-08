import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Pause, Square, Timer, RotateCcw } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseTimerProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function ExerciseTimer({ exercise, isOpen, onClose, onComplete }: ExerciseTimerProps) {
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'exercise' | 'rest' | 'completed'>('preparation');
  const [timeRemaining, setTimeRemaining] = useState(10); // 10 seconds preparation
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);

  // Parse exercise duration (e.g., "30 seconds", "2 minutes")
  const parseExerciseDuration = (duration?: string): number => {
    if (!duration) return 30;
    const minutes = duration.match(/(\d+)\s*minutes?/);
    const seconds = duration.match(/(\d+)\s*seconds?/);
    
    if (minutes) return parseInt(minutes[1]) * 60;
    if (seconds) return parseInt(seconds[1]);
    return 30; // default
  };

  // Parse rest duration (e.g., "30 seconds", "1 minute")
  const parseRestDuration = (rest: string): number => {
    const minutes = rest.match(/(\d+)\s*minutes?/);
    const seconds = rest.match(/(\d+)\s*seconds?/);
    
    if (minutes) return parseInt(minutes[1]) * 60;
    if (seconds) return parseInt(seconds[1]);
    return 30; // default
  };

  const exerciseDuration = parseExerciseDuration(exercise.duration);
  const restDuration = parseRestDuration(exercise.rest);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handlePhaseComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    
    switch (currentPhase) {
      case 'preparation':
        setCurrentPhase('exercise');
        setTimeRemaining(exerciseDuration);
        setIsRunning(true);
        break;
      case 'exercise':
        if (currentSet < totalSets) {
          setCurrentPhase('rest');
          setTimeRemaining(restDuration);
          setIsRunning(true);
        } else {
          setCurrentPhase('completed');
          onComplete();
        }
        break;
      case 'rest':
        setCurrentSet(prev => prev + 1);
        setCurrentPhase('exercise');
        setTimeRemaining(exerciseDuration);
        setIsRunning(true);
        break;
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    console.log('Starting exercise:', exercise.id);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase('preparation');
    setTimeRemaining(10);
    setCurrentSet(1);
  };

  const handleStop = () => {
    setIsRunning(false);
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'preparation': return 'Get Ready!';
      case 'exercise': return `Set ${currentSet} of ${totalSets}`;
      case 'rest': return 'Rest Time';
      case 'completed': return 'Excellent Work!';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'preparation': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'exercise': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'rest': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'preparation': return 'Prepare yourself for the exercise. Make sure you have enough space and are ready to begin.';
      case 'exercise': return exercise.description || 'Perform the exercise with proper form. Focus on your breathing and technique.';
      case 'rest': return 'Take a breather! Stay hydrated and prepare for the next set.';
      case 'completed': return 'You completed the exercise! Great job on your workout session.';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {exercise.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Phase Indicator */}
          <div className={`text-center p-4 rounded-lg ${getPhaseColor()}`}>
            <h3 className="text-lg font-semibold mb-2">{getPhaseTitle()}</h3>
            <p className="text-sm">{getPhaseInstruction()}</p>
          </div>

          {/* Timer Display */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPhase === 'preparation' && 'Preparation Time'}
                  {currentPhase === 'exercise' && 'Exercise Time'}
                  {currentPhase === 'rest' && 'Rest Time'}
                  {currentPhase === 'completed' && 'Completed!'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">Duration</div>
              <div className="text-gray-600 dark:text-gray-400">{exercise.duration || '30 seconds'}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">Rest</div>
              <div className="text-gray-600 dark:text-gray-400">{exercise.rest}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-3">
            {!isRunning && currentPhase !== 'completed' && (
              <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            
            {isRunning && (
              <Button onClick={handlePause} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={handleStop} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>

          {currentPhase === 'completed' && (
            <div className="text-center space-y-3">
              <p className="text-green-600 dark:text-green-400 font-semibold">
                🎉 Exercise completed! You're building stronger habits.
              </p>
              <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                Finish Workout
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}