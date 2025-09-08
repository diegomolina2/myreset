
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Droplets } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const DailyWaterLogger: React.FC = () => {
  const { state, logWater } = useApp();
  const [waterInput, setWaterInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayWaterLog = state.userData.waterLog.find(w => w.date === today);
  const todayWater = todayWaterLog?.liters || 0;

  const handleLogWater = async () => {
    const amount = parseFloat(waterInput);
    if (amount > 0) {
      setIsSaving(true);
      try {
        logWater(amount);
        setWaterInput('');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayWater > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Today's Water: {todayWater.toFixed(1)} liters
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="daily-water">Add Water (liters)</Label>
            <Input
              id="daily-water"
              type="number"
              step="0.1"
              value={waterInput}
              onChange={(e) => setWaterInput(e.target.value)}
              placeholder="e.g., 0.5"
            />
          </div>
          <Button 
            onClick={handleLogWater}
            disabled={!waterInput || isSaving}
            className="mt-6"
          >
            <Droplets className="w-4 h-4 mr-2" />
            {isSaving ? 'Logging...' : 'Log'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
