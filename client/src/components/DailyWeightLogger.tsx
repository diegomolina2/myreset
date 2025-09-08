
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Scale, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function DailyWeightLogger() {
  const { state, logWeight } = useApp();
  const [currentWeight, setCurrentWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { userData } = state;
  const today = new Date().toISOString().split('T')[0];
  const todayWeight = userData.weights.find(w => w.date === today);
  const recentWeights = userData.weights.slice(-7).reverse();
  
  const handleLogWeight = async () => {
    if (!currentWeight || parseFloat(currentWeight) <= 0) return;
    
    setIsSaving(true);
    try {
      logWeight(parseFloat(currentWeight));
      setCurrentWeight('');
    } finally {
      setIsSaving(false);
    }
  };
  
  const getWeightTrend = () => {
    if (recentWeights.length < 2) return null;
    const latest = recentWeights[0].weight;
    const previous = recentWeights[1].weight;
    return latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
  };
  
  const weightTrend = getWeightTrend();
  
  return (
    <div className="space-y-4">
      {/* Today's Weight */}
      {todayWeight ? (
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Weight</p>
                <p className="text-2xl font-bold text-green-600">{todayWeight.weight} kg</p>
              </div>
              <div className="flex items-center gap-2">
                {weightTrend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                {weightTrend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                <Scale className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="daily-weight">Today's Weight (kg)</Label>
              <Input
                id="daily-weight"
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="Enter your weight"
              />
            </div>
            <Button 
              onClick={handleLogWeight}
              disabled={!currentWeight || isSaving}
              className="mt-6"
            >
              <Scale className="w-4 h-4 mr-2" />
              {isSaving ? 'Logging...' : 'Log Weight'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Recent Weights */}
      {recentWeights.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Recent Weights</h4>
          <div className="space-y-2">
            {recentWeights.slice(0, 5).map((weightEntry, index) => (
              <div key={weightEntry.date} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(weightEntry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="font-medium">{weightEntry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
