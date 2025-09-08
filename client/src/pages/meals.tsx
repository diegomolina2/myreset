
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Utensils, Search, Filter, Eye, Plus, Clock, Target, Lock, Crown } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { MealLogDialog } from "../components/MealLogDialog";
import { usePlanAccess } from "../hooks/usePlanAccess";
import { UpgradePopup } from "../components/UpgradePopup";
import mealsData from "../data/meals.json";

interface Meal {
  id: string;
  name: {
    [key: string]: string;
  };
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  image?: string;
  preparation?: {
    [key: string]: string;
  };
  accessPlans: number[];
}

const meals = mealsData as Meal[];

function Meals() {
  const { t, currentLanguage } = useTranslation();
  const { state, dispatch } = useApp();
  const { hasAccess } = usePlanAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealToLog, setMealToLog] = useState<Meal | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const logMeal = (meal: Meal, date: string) => {
    const mealLog = {
      id: `${meal.id}-${Date.now()}`,
      mealId: meal.id,
      mealName: meal.name[currentLanguage] || meal.name["en-NG"],
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

    console.log(
      "Logging meal:",
      meal.name[currentLanguage] || meal.name["en-NG"],
      "for date:",
      date,
    );
  };

  const handleLogMealClick = (meal: Meal) => {
    const hasAccessToMeal = hasAccess(meal.accessPlans);
    if (!hasAccessToMeal) {
      setShowUpgradePopup(true);
      return;
    }
    setMealToLog(meal);
    setShowLogDialog(true);
  };

  const handleConfirmLog = (date: string) => {
    if (mealToLog) {
      logMeal(mealToLog, date);
      setMealToLog(null);
    }
  };

  // Get the next available plan name
  const getNextPlanName = (meal: Meal) => {
    const planNames = ["Free", "Momentum", "Premium", "Pro"];
    const minPlan = Math.min(...meal.accessPlans);
    return planNames[minPlan - 1] || "Premium";
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "breakfast":
        return "secondary";
      case "lunch":
        return "default";
      case "dinner":
        return "destructive";
      case "snack":
        return "outline";
      default:
        return "default";
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const searchTermLower = searchTerm.toLowerCase();

    const mealName =
      meal.name[currentLanguage] ||
      meal.name["en-NG"] ||
      Object.values(meal.name)[0] ||
      "";

    const mealNameLower = mealName.toLowerCase();

    const matchesSearch = mealNameLower.includes(searchTermLower);
    const matchesCategory =
      categoryFilter === "all" || meal.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardTitle className="text-3xl font-bold text-center mb-2">
            <Utensils className="w-8 h-8 inline mr-3" />
            {t("meals.title")}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {t("meals.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder={t("meals.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("meals.filter")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("meals.categories.all")}</SelectItem>
                    <SelectItem value="breakfast">
                      {t("meals.categories.breakfast")}
                    </SelectItem>
                    <SelectItem value="lunch">{t("meals.categories.lunch")}</SelectItem>
                    <SelectItem value="dinner">{t("meals.categories.dinner")}</SelectItem>
                    <SelectItem value="snack">{t("meals.categories.snack")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredMeals.length} {filteredMeals.length === 1 ? 'meal' : 'meals'} found
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((meal) => {
                const hasAccessToMeal = hasAccess(meal.accessPlans);
                const isLocked = !hasAccessToMeal;
                
                return (
                  <Card key={meal.id} className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ${isLocked ? "opacity-90" : ""}`}>
                    {/* Meal Image - Show lock icon if locked */}
                    <div className="aspect-video w-full overflow-hidden">
                      {isLocked ? (
                        <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                          <Lock className="w-16 h-16 text-gray-400" />
                        </div>
                      ) : meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name[currentLanguage] || meal.name["en-NG"]}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                          <Utensils className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg line-clamp-2">
                              {meal.name[currentLanguage] || meal.name["en-NG"]}
                            </CardTitle>
                            {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                          </div>
                          <Badge variant={getCategoryVariant(meal.category)} className="shrink-0 mt-1">
                            {t(`meals.categories.${meal.category}`)}
                          </Badge>
                          
                          {/* Show unlock message if locked */}
                          {isLocked && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 mt-2">
                              {t("meals.unlockedFrom", { plan: t(`meals.plans.${getNextPlanName(meal)}`) })}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Macronutrients Display - Show locks if locked */}
                      {isLocked ? (
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                            <div className="text-xs text-gray-400">{t("meals.calories")}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                            <div className="text-xs text-gray-400">{t("meals.protein")}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                            <div className="text-xs text-gray-400">{t("meals.carbs")}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                            <div className="text-xs text-gray-400">{t("meals.fats")}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                            <div className="text-xl font-bold text-orange-600">
                              {meal.calories}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("meals.calories")}
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <div className="text-lg font-semibold text-blue-600">
                              {meal.protein}g
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("meals.protein")}
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                            <div className="text-lg font-semibold text-green-600">
                              {meal.carbs}g
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("meals.carbs")}
                            </div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                            <div className="text-lg font-semibold text-purple-600">
                              {meal.fat}g
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("meals.fats")}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {isLocked ? (
                        <Button
                          onClick={() => setShowUpgradePopup(true)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          {t("meals.upgradeRequired")}
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setSelectedMeal(meal)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t("meals.view")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  {meal.name[currentLanguage] || meal.name["en-NG"]}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-6">
                                {meal.image && (
                                  <img
                                    src={meal.image}
                                    alt={meal.name[currentLanguage] || meal.name["en-NG"]}
                                    className="w-full h-64 object-cover rounded-lg"
                                  />
                                )}

                                {/* Detailed Macronutrients */}
                                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="text-center">
                                    <Target className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                                    <div className="font-bold text-xl text-orange-600">
                                      {meal.calories}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {t("meals.calories")}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-6 h-6 mx-auto mb-1 bg-blue-500 rounded"></div>
                                    <div className="font-semibold text-lg text-blue-600">
                                      {meal.protein}g
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {t("meals.protein")}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-6 h-6 mx-auto mb-1 bg-green-500 rounded"></div>
                                    <div className="font-semibold text-lg text-green-600">
                                      {meal.carbs}g
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {t("meals.carbs")}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-6 h-6 mx-auto mb-1 bg-purple-500 rounded"></div>
                                    <div className="font-semibold text-lg text-purple-600">
                                      {meal.fat}g
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {t("meals.fats")}
                                    </div>
                                  </div>
                                </div>

                                {/* Preparation Instructions */}
                                {meal.preparation && (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                      <Clock className="w-5 h-5" />
                                      {t("meals.preparation")}
                                    </h4>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <p className="text-sm leading-relaxed">
                                        {meal.preparation[currentLanguage] ||
                                          meal.preparation["en-NG"]}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Category Badge */}
                                <div className="flex justify-center">
                                  <Badge variant={getCategoryVariant(meal.category)} className="text-sm px-4 py-1">
                                    {t(`meals.categories.${meal.category}`)}
                                  </Badge>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button className="flex-1" onClick={() => handleLogMealClick(meal)}>
                            <Plus className="w-4 h-4 mr-2" />
                            {t("meals.logMeal")}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results Message */}
            {filteredMeals.length === 0 && (
              <div className="text-center py-12">
                <Utensils className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No meals found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meal Log Dialog */}
      <MealLogDialog
        isOpen={showLogDialog}
        onClose={() => setShowLogDialog(false)}
        onConfirm={handleConfirmLog}
        mealName={mealToLog ? (mealToLog.name[currentLanguage] || mealToLog.name["en-NG"]) : ""}
      />

      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        onUpgrade={() => {
          setShowUpgradePopup(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default Meals;
