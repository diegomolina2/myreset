import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Progress as ProgressBar } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  TrendingUp,
  Droplets,
  Scale,
  Calculator,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  Download,
  Upload,
  Utensils,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  WaterIntakeData,
  DailyCaloriesData,
  BodyCompositionData,
  calculateWaterIntake,
  getWaterIntakeMessage,
  calculateBMI,
  getBMIMessage,
  calculateDailyCalories,
  getCalorieMessage,
  calculateWaistToHipRatio,
  getWaistToHipMessage,
  calculateBodyFat,
  getBodyFatMessage,
  saveWaterIntake,
  loadWaterIntake,
  saveDailyCalories,
  loadDailyCalories,
  saveBodyComposition,
  loadBodyComposition,
  resetProgressData,
  isNewDay,
  getTodayDate,
} from "../utils/progressCalculations";
import { exportAllDataAsCSV } from "../utils/csvExport";
import { CSVImport } from "../components/CSVImport";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { DailyWeightLogger } from "../components/DailyWeightLogger";
import { DailyMoodLogger } from "../components/DailyMoodLogger";
import { Journal } from "../components/Journal";

export default function Progress() {
  const { state } = useApp();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { t } = useTranslation();
  const { logWeight, logMood, logWater, logCalories } = useApp();
  const [timeFilter, setTimeFilter] = useState("1month");
  const [calorieTimeFilter, setCalorieTimeFilter] = useState("1month");
  const { userData } = state;
  // Helper function to filter data by time period
  const filterDataByTime = (data: any[], filter: string) => {
    if (!Array.isArray(data)) {
      console.warn("filterDataByTime recebeu um valor inválido:", data);
      return [];
    }

    const now = new Date();
    const filterDate = new Date();

    switch (filter) {
      case "1week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      default:
        return data;
    }

    return data.filter((item) => new Date(item.date) >= filterDate);
  };

  // Get user's current weight from saved data
  const getCurrentUserWeight = () => {
    if (!userData) return 70;

    const latestWeight =
      userData.weights && userData.weights.length > 0
        ? userData.weights[userData.weights.length - 1].weight
        : null;

    const profileWeight = userData.weight || userData.userProfile?.weight;

    return latestWeight || profileWeight || 70;
  };

  // Get user's saved profile data
  const getUserProfileData = () => {
    const profile = userData.userProfile || {};
    const savedData = userData;

    return {
      weight: getCurrentUserWeight(),
      height: savedData.height || profile.height || 175,
      age: savedData.age || profile.age || 30,
      sex: savedData.sex || profile.gender || "male",
      activityLevel:
        savedData.activityLevel || profile.exerciseLevel || "moderate",
    };
  };

  // Water Intake State
  const [waterData, setWaterData] = useState<WaterIntakeData>({
    weight: getCurrentUserWeight(),
    activity: "moderate",
    goal: "maintain",
    recommendedMl: 2950,
    loggedMlToday: 0,
    lastUpdated: getTodayDate(),
  });
  const [waterInput, setWaterInput] = useState("");

  // Daily Calories State
  const userProfileData = getUserProfileData();
  const [caloriesData, setCaloriesData] = useState<DailyCaloriesData>({
    weight: userProfileData.weight,
    height: userProfileData.height,
    age: userProfileData.age,
    sex: userProfileData.sex,
    activity: userProfileData.activityLevel,
    goal: "maintain",
    BMI: 22.86,
    recommendedCalories: 2400,
    lastUpdated: getTodayDate(),
  });

  // Body Composition State
  const [bodyData, setBodyData] = useState<BodyCompositionData>({
    waist: 80,
    hip: 95,
    neck: 38,
    height: 175,
    sex: "male",
    waistToHipRatio: 0.842,
    bodyFatPercentage: 15.2,
    lastUpdated: getTodayDate(),
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWaterData = loadWaterIntake();
    const savedCaloriesData = loadDailyCalories();
    const savedBodyData = loadBodyComposition();
    const userProfile = getUserProfileData();

    if (savedWaterData) {
      // Reset water log if it's a new day
      if (isNewDay(savedWaterData.lastUpdated)) {
        savedWaterData.loggedMlToday = 0;
        savedWaterData.lastUpdated = getTodayDate();
      }
      // Update with current user weight if available
      savedWaterData.weight = userProfile.weight;
      setWaterData(savedWaterData);
    } else {
      // Set initial water data with user profile
      const initialWaterData = {
        ...waterData,
        weight: userProfile.weight,
        activity: userProfile.activityLevel
      };
      initialWaterData.recommendedMl = calculateWaterIntake(
        initialWaterData.weight,
        initialWaterData.activity,
        initialWaterData.goal
      );
      setWaterData(initialWaterData);
    }

    if (savedCaloriesData) {
      // Update with current user data
      const updatedCaloriesData = {
        ...savedCaloriesData,
        weight: userProfile.weight,
        height: userProfile.height,
        age: userProfile.age,
        sex: userProfile.sex,
        activity: userProfile.activityLevel
      };
      updatedCaloriesData.BMI = calculateBMI(updatedCaloriesData.weight, updatedCaloriesData.height);
      updatedCaloriesData.recommendedCalories = calculateDailyCalories(
        updatedCaloriesData.weight,
        updatedCaloriesData.height,
        updatedCaloriesData.age,
        updatedCaloriesData.sex,
        updatedCaloriesData.activity,
        updatedCaloriesData.goal
      );
      setCaloriesData(updatedCaloriesData);
    } else {
      // Set initial calories data with user profile
      const initialCaloriesData = {
        ...caloriesData,
        weight: userProfile.weight,
        height: userProfile.height,
        age: userProfile.age,
        sex: userProfile.sex,
        activity: userProfile.activityLevel
      };
      initialCaloriesData.BMI = calculateBMI(initialCaloriesData.weight, initialCaloriesData.height);
      initialCaloriesData.recommendedCalories = calculateDailyCalories(
        initialCaloriesData.weight,
        initialCaloriesData.height,
        initialCaloriesData.age,
        initialCaloriesData.sex,
        initialCaloriesData.activity,
        initialCaloriesData.goal
      );
      setCaloriesData(initialCaloriesData);
    }

    if (savedBodyData) {
      // Update with current user data
      const updatedBodyData = {
        ...savedBodyData,
        height: userProfile.height,
        sex: userProfile.sex
      };
      setBodyData(updatedBodyData);
    } else {
      // Set initial body data with user profile
      const initialBodyData = {
        ...bodyData,
        height: userProfile.height,
        sex: userProfile.sex
      };
      setBodyData(initialBodyData);
    }
  }, [userData]);

  // Water calculations
  const updateWaterCalculations = (newData: Partial<WaterIntakeData>) => {
    const updated = { ...waterData, ...newData };
    updated.recommendedMl = calculateWaterIntake(
      updated.weight,
      updated.activity,
      updated.goal,
    );
    updated.lastUpdated = getTodayDate();
    setWaterData(updated);
    saveWaterIntake(updated);
  };

  // Calories calculations
  const updateCaloriesCalculations = (newData: Partial<DailyCaloriesData>) => {
    const updated = { ...caloriesData, ...newData };
    updated.BMI = calculateBMI(updated.weight, updated.height);
    updated.recommendedCalories = calculateDailyCalories(
      updated.weight,
      updated.height,
      updated.age,
      updated.sex,
      updated.activity,
      updated.goal,
    );
    updated.lastUpdated = getTodayDate();
    setCaloriesData(updated);
    saveDailyCalories(updated);
  };

  // Body composition calculations
  const updateBodyCalculations = (newData: Partial<BodyCompositionData>) => {
    const updated = { ...bodyData, ...newData };
    updated.waistToHipRatio = calculateWaistToHipRatio(
      updated.waist,
      updated.hip,
    );
    updated.bodyFatPercentage = calculateBodyFat(
      updated.waist,
      updated.hip,
      updated.neck,
      updated.height,
      updated.sex,
    );
    updated.lastUpdated = getTodayDate();
    setBodyData(updated);
    saveBodyComposition(updated);
  };

  // Handle water logging
  const handleLogWater = () => {
    const amount = parseFloat(waterInput);
    if (amount > 0) {
      updateWaterCalculations({
        loggedMlToday: waterData.loggedMlToday + amount * 1000,
      });
      // Also log to global context for charts
      logWater(amount);
      setWaterInput("");
    }
  };

  // Reset all progression data
  const handleResetProgression = () => {
    if (
      confirm(
        "Are you sure you want to reset all progression data? This cannot be undone.",
      )
    ) {
      resetProgressData();
      setWaterData({
        weight: 70,
        activity: "moderate",
        goal: "maintain",
        recommendedMl: 2950,
        loggedMlToday: 0,
        lastUpdated: getTodayDate(),
      });
      setCaloriesData({
        weight: 70,
        height: 175,
        age: 30,
        sex: "male",
        activity: "moderate",
        goal: "maintain",
        BMI: 22.86,
        recommendedCalories: 2400,
        lastUpdated: getTodayDate(),
      });
      setBodyData({
        waist: 80,
        hip: 95,
        neck: 38,
        height: 175,
        sex: "male",
        waistToHipRatio: 0.842,
        bodyFatPercentage: 15.2,
        lastUpdated: getTodayDate(),
      });
    }
  };

  // Prepare chart data
  const weightData = userData.weights.slice(-30).map((w) => ({
    date: new Date(w.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: w.weight,
  }));

  const waterChartData = userData.waterLog.slice(-7).map((w) => ({
    date: new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }),
    liters: Number(w.liters.toFixed(1)),
  }));

  const waterPercentage = Math.min(
    100,
    (waterData.loggedMlToday / waterData.recommendedMl) * 100,
  );

  // Process calorie data
  const calorieData = useMemo(() => {
    const mealLogs = state.userData.mealLogs || [];
    const dailyCalories: { [key: string]: number } = {};

    mealLogs.forEach((log) => {
      if (dailyCalories[log.date]) {
        dailyCalories[log.date] += log.calories;
      } else {
        dailyCalories[log.date] = log.calories;
      }
    });

    const chartData = Object.entries(dailyCalories)
      .map(([date, calories]) => ({
        date,
        calories,
        formattedDate: new Date(date).toLocaleDateString(),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filterDataByTime(chartData, calorieTimeFilter);
  }, [state.userData.mealLogs, calorieTimeFilter]);

  const filteredWeightData = filterDataByTime(weightData, timeFilter);
  const filteredWaterData = filterDataByTime(waterChartData, timeFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="NaijaReset Logo"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                  NaijaReset Progress
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track your wellness journey with detailed metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="journal">📖 Journal</TabsTrigger>
            <TabsTrigger value="water">💧 Water</TabsTrigger>
            <TabsTrigger value="calories">🔥 Calories</TabsTrigger>
            <TabsTrigger value="body">📏 Body Comp</TabsTrigger>
            <TabsTrigger value="charts">📊 Charts</TabsTrigger>
          </TabsList>

          {/* Journal Tab */}
          <TabsContent value="journal" className="mt-6">
            <Journal />
          </TabsContent>

          {/* Water Intake Tab */}
          <TabsContent value="water" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Water Intake Calculator & Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="water-weight">Weight (kg)</Label>
                    <Input
                      id="water-weight"
                      type="number"
                      value={waterData.weight}
                      onChange={(e) =>
                        updateWaterCalculations({
                          weight: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="water-activity">Activity Level</Label>
                    <Select
                      value={waterData.activity}
                      onValueChange={(
                        value: "sedentary" | "moderate" | "active",
                      ) => updateWaterCalculations({ activity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="water-goal">Goal</Label>
                    <Select
                      value={waterData.goal}
                      onValueChange={(value: "lose" | "gain" | "maintain") =>
                        updateWaterCalculations({ goal: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose Weight</SelectItem>
                        <SelectItem value="gain">Gain Weight</SelectItem>
                        <SelectItem value="maintain">
                          Maintain Weight
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        Daily Water Target
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {waterData.recommendedMl}ml
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ({(waterData.recommendedMl / 1000).toFixed(1)} liters)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Today's Progress
                      </p>
                      <p className="text-2xl font-bold text-blue-500">
                        {waterData.loggedMlToday}ml
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ({(waterData.loggedMlToday / 1000).toFixed(1)} liters)
                      </p>
                    </div>
                  </div>

                  <ProgressBar value={waterPercentage} className="h-3" />

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm">
                      {getWaterIntakeMessage(
                        waterData.loggedMlToday,
                        waterData.recommendedMl,
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Water Logging */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Log Water Intake</h3>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={waterInput}
                      onChange={(e) => setWaterInput(e.target.value)}
                      placeholder="Amount in liters (e.g., 0.5)"
                      className="flex-1"
                    />
                    <Button onClick={handleLogWater} disabled={!waterInput}>
                      <Droplets className="w-4 h-4 mr-2" />
                      Log Water
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Calories Tab */}
          <TabsContent value="calories" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Daily Calories & BMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cal-weight">Weight (kg)</Label>
                    <Input
                      id="cal-weight"
                      type="number"
                      value={caloriesData.weight}
                      onChange={(e) =>
                        updateCaloriesCalculations({
                          weight: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cal-height">Height (cm)</Label>
                    <Input
                      id="cal-height"
                      type="number"
                      value={caloriesData.height}
                      onChange={(e) =>
                        updateCaloriesCalculations({
                          height: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cal-age">Age</Label>
                    <Input
                      id="cal-age"
                      type="number"
                      value={caloriesData.age}
                      onChange={(e) =>
                        updateCaloriesCalculations({
                          age: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cal-sex">Sex</Label>
                    <Select
                      value={caloriesData.sex}
                      onValueChange={(value: "male" | "female") =>
                        updateCaloriesCalculations({ sex: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cal-activity">Activity Level</Label>
                    <Select
                      value={caloriesData.activity}
                      onValueChange={(value: any) =>
                        updateCaloriesCalculations({ activity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">
                          Moderately Active
                        </SelectItem>
                        <SelectItem value="active">Very Active</SelectItem>
                        <SelectItem value="very_active">
                          Extra Active
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cal-goal">Goal</Label>
                    <Select
                      value={caloriesData.goal}
                      onValueChange={(value: "lose" | "gain" | "maintain") =>
                        updateCaloriesCalculations({ goal: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose Weight</SelectItem>
                        <SelectItem value="gain">Gain Weight</SelectItem>
                        <SelectItem value="maintain">
                          Maintain Weight
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Body Mass Index (BMI)
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {caloriesData.BMI}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {getBMIMessage(caloriesData.BMI).includes("healthy")
                          ? "✅"
                          : "⚠️"}
                        {caloriesData.BMI < 18.5
                          ? "Underweight"
                          : caloriesData.BMI < 25
                            ? "Normal"
                            : caloriesData.BMI < 30
                              ? "Overweight"
                              : "Obese"}
                      </Badge>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="text-sm">
                        {getBMIMessage(caloriesData.BMI)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Daily Calorie Target
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {caloriesData.recommendedCalories}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        calories per day
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <p className="text-sm">
                        {getCalorieMessage(
                          caloriesData.recommendedCalories,
                          caloriesData.goal,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Body Composition Tab */}
          <TabsContent value="body" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-green-500" />
                  Body Composition Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="body-waist">Waist (cm)</Label>
                    <Input
                      id="body-waist"
                      type="number"
                      value={bodyData.waist}
                      onChange={(e) =>
                        updateBodyCalculations({
                          waist: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-hip">Hip (cm)</Label>
                    <Input
                      id="body-hip"
                      type="number"
                      value={bodyData.hip}
                      onChange={(e) =>
                        updateBodyCalculations({
                          hip: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-neck">Neck (cm)</Label>
                    <Input
                      id="body-neck"
                      type="number"
                      value={bodyData.neck}
                      onChange={(e) =>
                        updateBodyCalculations({
                          neck: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-height">Height (cm)</Label>
                    <Input
                      id="body-height"
                      type="number"
                      value={bodyData.height}
                      onChange={(e) =>
                        updateBodyCalculations({
                          height: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-sex">Sex</Label>
                    <Select
                      value={bodyData.sex}
                      onValueChange={(value: "male" | "female") =>
                        updateBodyCalculations({ sex: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Waist-to-Hip Ratio
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {bodyData.waistToHipRatio}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {getWaistToHipMessage(
                          bodyData.waistToHipRatio,
                          bodyData.sex,
                        ).includes("Low")
                          ? "✅"
                          : getWaistToHipMessage(
                                bodyData.waistToHipRatio,
                                bodyData.sex,
                              ).includes("Moderate")
                            ? "⚠️"
                            : "🚨"}
                        {
                          getWaistToHipMessage(
                            bodyData.waistToHipRatio,
                            bodyData.sex,
                          ).split(" ")[0]
                        }{" "}
                        Risk
                      </Badge>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm">
                        {getWaistToHipMessage(
                          bodyData.waistToHipRatio,
                          bodyData.sex,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Body Fat Percentage
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {bodyData.bodyFatPercentage}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        US Navy Method
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm">
                        {getBodyFatMessage(
                          bodyData.bodyFatPercentage,
                          bodyData.sex,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="mt-6 space-y-6">
            {/* Weight Progress Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {t("progress.charts.weightProgress")}
                  </div>
                </CardTitle>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">
                      {t("progress.timeFilters.1week")}
                    </SelectItem>
                    <SelectItem value="1month">
                      {t("progress.timeFilters.1month")}
                    </SelectItem>
                    <SelectItem value="3months">
                      {t("progress.timeFilters.3months")}
                    </SelectItem>
                    <SelectItem value="6months">
                      {t("progress.timeFilters.6months")}
                    </SelectItem>
                    <SelectItem value="max">
                      {t("progress.timeFilters.max")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={filteredWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: any) => [`${value} kg`, "Weight"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    {t("progress.charts.waterIntake")}
                  </div>
                </CardTitle>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">
                      {t("progress.timeFilters.1week")}
                    </SelectItem>
                    <SelectItem value="1month">
                      {t("progress.timeFilters.1month")}
                    </SelectItem>
                    <SelectItem value="3months">
                      {t("progress.timeFilters.3months")}
                    </SelectItem>
                    <SelectItem value="6months">
                      {t("progress.timeFilters.6months")}
                    </SelectItem>
                    <SelectItem value="max">
                      {t("progress.timeFilters.max")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={filteredWaterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: any) => [`${value}L`, "Water"]}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    {t("progress.charts.calorieIntake")}
                  </div>
                </CardTitle>
                <Select
                  value={calorieTimeFilter}
                  onValueChange={setCalorieTimeFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">
                      {t("progress.timeFilters.1week")}
                    </SelectItem>
                    <SelectItem value="1month">
                      {t("progress.timeFilters.1month")}
                    </SelectItem>
                    <SelectItem value="3months">
                      {t("progress.timeFilters.3months")}
                    </SelectItem>
                    <SelectItem value="6months">
                      {t("progress.timeFilters.6months")}
                    </SelectItem>
                    <SelectItem value="max">
                      {t("progress.timeFilters.max")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={calorieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: any) => [`${value} cal`, "Calories"]}
                    />
                    <Bar dataKey="calories" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
