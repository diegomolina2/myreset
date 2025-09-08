
import React, { useState } from "react";
import { Meal } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, Plus, Clock, Utensils, Lock, Crown } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { usePlanAccess } from "../hooks/usePlanAccess";
import { UpgradePopup } from "./UpgradePopup";
import { MealLogDialog } from "./MealLogDialog";

interface MealCardProps {
  meal: Meal;
  onLogMeal?: () => void;
  showCategory?: boolean;
}

export function MealCard({
  meal,
  onLogMeal,
  showCategory = true,
}: MealCardProps) {
  const { t, currentLanguage } = useTranslation();
  const { state, toggleFavorite } = useApp();
  const { hasAccess } = usePlanAccess();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);

  const hasAccessToMeal = hasAccess(meal.accessPlans);
  const isLocked = !hasAccessToMeal;

  const isFavorite = state.userData.favorites.meals.includes(meal.id);

  const handleToggleFavorite = () => {
    if (isLocked) {
      setShowUpgradePopup(true);
      return;
    }
    toggleFavorite("meals", meal.id);
  };

  const handleLogMealOriginal = () => {
    if (isLocked) {
      setShowUpgradePopup(true);
      return;
    }

    setShowLogDialog(true);
  };

  const handleConfirmLog = (date: string) => {
    // Create meal log entry
    const { dispatch } = useApp();
    const mealLog = {
      id: `${meal.id}-${Date.now()}`,
      mealId: meal.id,
      mealName: getMealName(),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      date: date,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
    };

    const existingLogs = state.userData.mealLogs || [];
    const updatedLogs = [...existingLogs, mealLog];

    dispatch({
      type: "SET_USER_DATA",
      payload: {
        ...state.userData,
        mealLogs: updatedLogs,
      },
    });

    if (onLogMeal) {
      onLogMeal();
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "lunch":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "dinner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "snack":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Get the meal name for the current language, fallback to English Nigeria
  const getMealName = () => {
    if (typeof meal.name === 'string') {
      return meal.name;
    }
    return meal.name[currentLanguage] || meal.name['en-NG'] || 'Meal';
  };

  // Get the meal description for the current language, fallback to English Nigeria
  const getMealDescription = () => {
    if (typeof meal.description === 'string') {
      return meal.description;
    }
    return meal.description?.[currentLanguage] || meal.description?.['en-NG'] || '';
  };

  // Get the next available plan name
  const getNextPlanName = () => {
    const planNames = ["Free", "Momentum", "Premium", "Pro"];
    const minPlan = Math.min(...meal.accessPlans);
    return planNames[minPlan - 1] || "Premium";
  };

  return (
    <Card
      className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${isLocked ? "opacity-90" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100 mb-1">
                {getMealName()}
              </CardTitle>
              {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
            </div>
            
            {/* Show category */}
            {showCategory && meal.category && (
              <Badge className={`text-xs mb-2 ${getCategoryColor(meal.category)}`}>
                {t(`meals.categories.${meal.category}`)}
              </Badge>
            )}

            {/* Show unlock message if locked */}
            {isLocked && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                  {t("meals.unlockedFrom", { plan: t(`meals.plans.${getNextPlanName()}`) })}
                </Badge>
              </div>
            )}
          </div>
          
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite && !isLocked
                ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-800 dark:text-red-300"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite && !isLocked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Meal Image - Show lock icon if locked */}
          <div className="relative h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {isLocked ? (
              <div className="flex items-center justify-center h-full">
                <Lock className="w-16 h-16 text-gray-400" />
              </div>
            ) : meal.image ? (
              <img
                src={meal.image}
                alt={getMealName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Utensils className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Meal Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Utensils className="w-4 h-4 text-gray-500" />
                {isLocked ? (
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">
                      {t("common.calories")}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {meal.calories} {t("common.calories")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Nutritional Info - Show locks if locked */}
          {isLocked ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                <div className="text-xs text-gray-400">Protein</div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                <div className="text-xs text-gray-400">Carbs</div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                <div className="text-xs text-gray-400">Fat</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-sm font-bold text-blue-600">{meal.protein}g</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-sm font-bold text-green-600">{meal.carbs}g</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-sm font-bold text-purple-600">{meal.fat}g</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Fat</div>
              </div>
            </div>
          )}

          {/* Preparation - Show lock if locked */}
          {isLocked ? (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Preparation locked</span>
            </div>
          ) : (
            meal.preparation && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {typeof meal.preparation === 'string' 
                    ? meal.preparation 
                    : meal.preparation[currentLanguage] || meal.preparation['en-NG'] || ''}
                </p>
              </div>
            )
          )}

          {/* Action Button */}
          {onLogMeal &&
            (isLocked ? (
              <Button
                onClick={() => setShowUpgradePopup(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t("meals.upgradeRequired")}
              </Button>
            ) : (
              <Button
                onClick={handleLogMealOriginal}
                className="w-full bg-secondary hover:bg-secondary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("meals.logMeal")}
              </Button>
            ))}
        </div>
      </CardContent>

      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        onUpgrade={() => {
          setShowUpgradePopup(false);
          window.location.reload();
        }}
      />

      {/* Meal Log Dialog */}
      <MealLogDialog
        isOpen={showLogDialog}
        onClose={() => setShowLogDialog(false)}
        onConfirm={handleConfirmLog}
        mealName={getMealName()}
      />
    </Card>
  );
}
