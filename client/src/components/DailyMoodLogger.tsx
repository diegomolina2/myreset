
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const moodEmojis = [
  { emoji: '😞', label: 'Very Sad', value: '😞' },
  { emoji: '😐', label: 'Neutral', value: '😐' },
  { emoji: '🙂', label: 'Good', value: '🙂' },
  { emoji: '😊', label: 'Happy', value: '😊' },
  { emoji: '😄', label: 'Very Happy', value: '😄' }
];

export function DailyMoodLogger() {
  const { t } = useTranslation();
  const { state, logMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [todayMood, setTodayMood] = useState<string>('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const existingMood = state.userData.moods.find(m => m.date === today);
    if (existingMood) {
      setTodayMood(existingMood.mood);
      setSelectedMood(existingMood.mood);
    }
  }, [state.userData.moods]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      logMood(selectedMood as '😞' | '😐' | '🙂' | '😊' | '😄');
      setTodayMood(selectedMood);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-poppins">
          {t('progress.dailyMood') || 'Daily Mood'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayMood && (
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Today's mood:
              </p>
              <span className="text-3xl">{todayMood}</span>
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleMoodSelect(mood.value)}
                className="text-2xl p-3 hover:scale-110 transition-transform"
                title={mood.label}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>

          {selectedMood && selectedMood !== todayMood && (
            <Button
              onClick={handleSaveMood}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {todayMood ? 'Update Mood' : 'Save Mood'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
