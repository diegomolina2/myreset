import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Calendar,
  Droplets,
  Target,
  Heart,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Weight,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";

export function Journal() {
  const { t } = useTranslation();
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Helper functions to navigate dates
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (currentDate < tomorrow) {
      currentDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    }
  };

  // Function to delete a meal log
  const deleteMealLog = (mealLogId: string) => {
    const updatedMealLogs = state.userData.mealLogs?.filter(
      log => log.id !== mealLogId
    ) || [];

    dispatch({
      type: "SET_USER_DATA",
      payload: {
        ...state.userData,
        mealLogs: updatedMealLogs,
      },
    });
  };

  // Get data for selected date
  const dayData = useMemo(() => {
    const waterLogs = state.userData.waterLog?.filter(
      (log) => log.date === selectedDate
    ) || [];
    const mealLogs = state.userData.mealLogs?.filter(
      (log) => log.date === selectedDate
    ) || [];
    const moodLogs = state.userData.moodLogs?.filter(
      (log) => log.date === selectedDate
    ) || [];
    const weightLogs = state.userData.weights?.filter(
      (log) => log.date === selectedDate
    ) || [];

    const totalWater = waterLogs.reduce((sum, log) => sum + log.liters, 0);
    const totalCalories = mealLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = mealLogs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = mealLogs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFat = mealLogs.reduce((sum, log) => sum + log.fat, 0);
    const lastMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null;
    const dayWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;

    return {
      water: totalWater,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      mood: lastMood,
      weight: dayWeight,
      mealLogs,
      waterLogs,
    };
  }, [selectedDate, state.userData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodEmoji = (mood: number) => {
    const moodMap = {
      1: "😢",
      2: "😔",
      3: "😐",
      4: "😊",
      5: "😄",
    };
    return moodMap[mood as keyof typeof moodMap] || "😐";
  };

  const getMoodLabel = (mood: number) => {
    const moodLabels = {
      1: "Very Sad",
      2: "Sad",
      3: "Neutral",
      4: "Happy",
      5: "Very Happy",
    };
    return moodLabels[mood as keyof typeof moodLabels] || "Unknown";
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const isFuture = new Date(selectedDate) > new Date();

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Journal
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextDay}
                disabled={isFuture}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="journal-date">Select Date</Label>
              <Input
                id="journal-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {formatDate(selectedDate)}
              </h2>
              {isToday && (
                <Badge variant="secondary" className="mt-1">
                  Today
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water Intake */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dayData.water.toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">
                {dayData.waterLogs.length} log{dayData.waterLogs.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dayData.calories}
              </div>
              <div className="text-sm text-muted-foreground">
                {dayData.mealLogs.length} meal{dayData.mealLogs.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {dayData.mood ? (
                <>
                  <div className="text-3xl mb-1">
                    {getMoodEmoji(dayData.mood.mood)}
                  </div>
                  <div className="text-sm font-medium">
                    {getMoodLabel(dayData.mood.mood)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dayData.mood.time}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">
                  <div className="text-2xl">😐</div>
                  <div className="text-sm">No mood logged</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weight */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Weight className="w-4 h-4 text-purple-500" />
              Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {dayData.weight ? (
                <>
                  <div className="text-2xl font-bold text-purple-600">
                    {dayData.weight.weight} kg
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dayData.weight.time}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">
                  <div className="text-2xl">-</div>
                  <div className="text-sm">No weight logged</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macronutrients Summary */}
      {dayData.mealLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Macronutrients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {dayData.protein.toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {dayData.carbs.toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {dayData.fat.toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Water Logs */}
      {dayData.waterLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Water Intake Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayData.waterLogs.map((waterLog, index) => (
                <div key={waterLog.id || index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {waterLog.liters}L water
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {waterLog.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">
                      {(waterLog.liters * 1000).toFixed(0)}ml
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Logs */}
      {dayData.mealLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Meals Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayData.mealLogs.map((meal, index) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{meal.mealName}</div>
                    <div className="text-sm text-muted-foreground">
                      {meal.time}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold text-orange-600">
                      {meal.calories} cal
                    </div>
                    <div className="text-xs text-muted-foreground">
                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMealLog(meal.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {dayData.water === 0 && dayData.calories === 0 && !dayData.mood && !dayData.weight && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data for this day</h3>
            <p className="text-muted-foreground">
              {isToday
                ? "Start logging your meals, water intake, mood, and weight to see your daily progress."
                : "No activities were logged on this date."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}