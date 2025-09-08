import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Bell,
  Moon,
  Sun,
  TrendingUp,
  Droplets,
  Zap,
  Award,
  Play,
  Download,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../components/ThemeProvider";
import { ChallengeCard } from "../components/ChallengeCard";
import { MealCard } from "../components/MealCard";
import { ExerciseCard } from "../components/ExerciseCard";
import { BadgeCard } from "../components/BadgeCard";
import { getCurrentStreak } from "../utils/storage";
import challengesData from "../data/challenges.json";
import mealsData from "../data/meals.json";
import exercisesData from "../data/exercises.json";
import { useLocation } from "wouter";
import { exportAllDataAsCSV } from "../utils/csvExport";

export default function Dashboard() {
  const { t, getRandomQuote } = useTranslation();
  const { state } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const { userData } = state;
  const streak = getCurrentStreak();

  // Get today's data
  const today = new Date().toISOString().split("T")[0];
  const todayWeight =
    userData.weights.find((w) => w.date === today)?.weight ||
    userData.userProfile.weight;
  const todayWater =
    userData.waterLog.find((w) => w.date === today)?.liters || 0;
  const unlockedBadges = userData.badges.filter((b) => b.isUnlocked);

  // Get active challenges
  const activeChallenges = Object.values(userData.challenges).filter(
    (c) => c.isActive,
  );

  // Get suggested meals (random selection)
  const suggestedMeals = mealsData.slice(0, 2);

  // Get quick exercise (random selection)
  const quickExercise = exercisesData[0];

  // Get recent badges
  const recentBadges = unlockedBadges.slice(-3);

  // Get motivational quote
  const dailyQuote = getRandomQuote();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return t("dashboard.greeting", { name: userData.userProfile.name });
    if (hour < 18)
      return t("dashboard.greeting", {
        name: userData.userProfile.name,
      }).replace("morning", "afternoon");
    return t("dashboard.greeting", { name: userData.userProfile.name }).replace(
      "morning",
      "evening",
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="My Reset Logo"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                  My Reset
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {getGreeting()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* CSV Export */}
              <Button
                onClick={() => exportAllDataAsCSV(userData)}
                variant="ghost"
                size="sm"
                className="p-2 rounded-full text-green-600 hover:text-green-700"
              >
                <Download className="w-6 h-6" />
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="p-2 rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </Button>

              {/* Notification Bell */}
              <Button
                onClick={() => {
                  if (activeChallenges.length > 0) {
                    setLocation("/challenges");
                  } else {
                    alert("No active challenges. Start a challenge to get notifications!");
                  }
                }}
                variant="ghost"
                size="sm"
                className="p-2 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="w-6 h-6" />
                {activeChallenges.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeChallenges.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Motivational Quote */}
      {dailyQuote && (
        <div className="px-4 py-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border-none">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200 italic text-center">
                "{dailyQuote}"
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.currentWeight")}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {todayWeight}
                    {t("common.kg")}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.waterToday")}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {todayWater}
                    {t("common.liters")}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.streak")}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {streak} {t("dashboard.stats.days")}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.badges")}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {unlockedBadges.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            {t("dashboard.activeChallenges")}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/challenges")}
          >
            View All
          </Button>
        </div>

        {activeChallenges.length > 0 ? (
          <div className="space-y-4">
            {activeChallenges.slice(0, 2).map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onViewDetails={() => setLocation("/challenges")}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No active challenges. Start one to begin your wellness journey!
            </p>
            <Button
              onClick={() => setLocation("/challenges")}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Challenges
            </Button>
          </Card>
        )}
      </div>

      {/* Today's Meal Suggestions */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            {t("dashboard.todayMealSuggestions")}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/meals")}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onLogMeal={() => {
                /* Add meal logging logic */
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Exercise */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-poppins font-bold text-gray-800 dark:text-gray-100 mb-4">
          {t("dashboard.quickExercise")}
        </h2>

        <div className="max-w-md">
          <ExerciseCard
            exercise={quickExercise}
            onStart={() => {
              /* Add exercise start logic */
            }}
          />
        </div>
      </div>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-bold text-gray-800 dark:text-gray-100">
              {t("dashboard.recentAchievements")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/badges")}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
