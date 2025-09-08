import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Search, Filter, Heart, Play } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { ExerciseCard } from "../components/ExerciseCard";
import exercisesData from "../data/exercises.json";
import {
  hasAccessToContent,
  getCurrentPlan,
  PLANS,
} from "../utils/planManager";

export default function Exercises() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const { userData } = state;
  const favoriteExercises = exercisesData.filter((exercise) =>
    userData.favorites.exercises.includes(exercise.id),
  );

  const filteredExercises = exercisesData.filter((exercise) => {
    const exerciseName = typeof exercise.name === 'string' ? exercise.name : (exercise.name[state.language] || exercise.name['en-NG']);
    const exerciseDescription = typeof exercise.description === 'string' ? exercise.description : (exercise.description[state.language] || exercise.description['en-NG']);
    
    const matchesSearch =
      exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exerciseDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesPlan =
      selectedPlan === "all" ||
      (exercise.accessPlans &&
        exercise.accessPlans.some((planId) => {
          const plan = getCurrentPlan();
          return selectedPlan === "accessible"
            ? plan && exercise.accessPlans.includes(plan.id)
            : selectedPlan === "kickstart"
              ? exercise.accessPlans.includes(1)
              : selectedPlan === "momentum"
                ? exercise.accessPlans.includes(2)
                : selectedPlan === "thrive"
                  ? exercise.accessPlans.includes(3)
                  : selectedPlan === "total"
                    ? exercise.accessPlans.includes(4)
                    : true;
        }));
    return matchesSearch && matchesCategory && matchesPlan;
  });

  const categories = ["all", "Light", "Moderate", "Advanced"];
  const categoryCounts = {
    all: exercisesData.length,
    Light: exercisesData.filter((e) => e.category === "Light").length,
    Moderate: exercisesData.filter((e) => e.category === "Moderate").length,
    Advanced: exercisesData.filter((e) => e.category === "Advanced").length,
  };

  const plans = [
    "all",
    "accessible",
    "kickstart",
    "momentum",
    "thrive",
    "total",
  ];
  const planCounts = {
    all: exercisesData.length,
    accessible: exercisesData.filter((e) => hasAccessToContent(e)).length,
    kickstart: exercisesData.filter(
      (e) => e.accessPlans && e.accessPlans.includes(1),
    ).length,
    momentum: exercisesData.filter(
      (e) => e.accessPlans && e.accessPlans.includes(2),
    ).length,
    thrive: exercisesData.filter(
      (e) => e.accessPlans && e.accessPlans.includes(3),
    ).length,
    total: exercisesData.filter(
      (e) => e.accessPlans && e.accessPlans.includes(4),
    ).length,
  };

  const ExerciseStats = () => (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {categories.map((category) => (
        <Card
          key={category}
          className={`text-center cursor-pointer transition-colors ${
            selectedCategory === category
              ? "border-primary bg-primary/10"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          <CardContent className="p-3">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {categoryCounts[category as keyof typeof categoryCounts]}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {category === "all"
                ? "All"
                : t(`exercises.categories.${category}`)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const handleStartExercise = (exerciseId: string) => {
    const userData = state.userData;
    const today = new Date().toISOString().split("T")[0];

    const newExerciseEntry = {
      exerciseId,
      date: today,
      duration: exercisesData.find((e) => e.id === exerciseId)?.duration || 0,
      completed: true,
    };

    const updatedUserData = {
      ...userData,
      exerciseHistory: [...(userData.exerciseHistory || []), newExerciseEntry],
    };

    // Save to localStorage
    localStorage.setItem(
      "wellness_tracker_data",
      JSON.stringify(updatedUserData),
    );

    // Check for badge unlocks
    import("../utils/storage").then(({ checkAndUnlockBadges }) => {
      checkAndUnlockBadges();
    });

    const exercise = exercisesData.find((e) => e.id === exerciseId);
    const exerciseName = typeof exercise?.name === 'string' ? exercise.name : (exercise?.name?.[state.language] || exercise?.name?.['en-NG']);
    
    alert(
      `Started ${exerciseName}! Keep up the good work!`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                {t("exercises.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Home-friendly exercises for every fitness level
              </p>
            </div>
            {getCurrentPlan() && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {getCurrentPlan()?.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        <ExerciseStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoriteExercises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Category Filter */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === "all"
                    ? "All"
                    : t(`exercises.categories.${category}`)}
                  <Badge variant="secondary" className="ml-2">
                    {categoryCounts[category as keyof typeof categoryCounts]}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Plan Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {plans.map((plan) => (
                <Button
                  key={plan}
                  variant={selectedPlan === plan ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlan(plan)}
                  className="whitespace-nowrap"
                >
                  {plan === "all"
                    ? "Todos os Planos"
                    : plan === "accessible"
                      ? "Acessíveis"
                      : plan === "kickstart"
                        ? "Kickstart"
                        : plan === "momentum"
                          ? "Momentum"
                          : plan === "thrive"
                            ? "Thrive"
                            : plan === "total"
                              ? "Total"
                              : plan}
                  <Badge variant="secondary" className="ml-2">
                    {planCounts[plan as keyof typeof planCounts]}
                  </Badge>
                </Button>
              ))}
            </div>

            {filteredExercises.length > 0 ? (
              <div className="grid gap-4">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => handleStartExercise(exercise.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No exercises found matching your criteria.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favoriteExercises.length > 0 ? (
              <div className="grid gap-4">
                {favoriteExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => handleStartExercise(exercise.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No favorite exercises yet. Start adding exercises to your
                  favorites!
                </p>
                <Button
                  onClick={() => setSelectedCategory("all")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse All Exercises
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
