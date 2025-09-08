// Health calculation utilities for progress tracking

export interface WaterIntakeData {
  weight: number;
  activity: 'sedentary' | 'moderate' | 'active';
  goal: 'lose' | 'gain' | 'maintain';
  recommendedMl: number;
  loggedMlToday: number;
  lastUpdated: string;
}

export interface DailyCaloriesData {
  weight: number;
  height: number;
  age: number;
  sex: 'male' | 'female';
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'gain' | 'maintain';
  BMI: number;
  recommendedCalories: number;
  lastUpdated: string;
}

export interface BodyCompositionData {
  waist: number;
  hip: number;
  neck: number;
  height: number;
  sex: 'male' | 'female';
  waistToHipRatio: number;
  bodyFatPercentage: number;
  lastUpdated: string;
}

// Water intake calculations
export const calculateWaterIntake = (weight: number, activity: string, goal: string): number => {
  let baseWater = 35 * weight; // Base: 35ml × weight (kg)
  
  if (activity === 'moderate') baseWater += 500;
  if (activity === 'active') baseWater += 1000;
  if (goal === 'lose') baseWater += 500;
  
  return Math.round(baseWater);
};

export const getWaterIntakeMessage = (logged: number, recommended: number): string => {
  const percentage = Math.round((logged / recommended) * 100);
  
  if (percentage >= 100) return `🎉 Excellent! You've reached ${percentage}% of your daily water goal!`;
  if (percentage >= 75) return `💧 Great job! You've reached ${percentage}% of your daily goal.`;
  if (percentage >= 50) return `👍 Good progress! You've reached ${percentage}% of your daily goal.`;
  if (percentage >= 25) return `💪 Keep going! You've reached ${percentage}% of your daily goal.`;
  return `🚰 Let's hydrate! You've reached ${percentage}% of your daily goal.`;
};

// BMI and calorie calculations
export const calculateBMI = (weight: number, height: number): number => {
  return Number((weight / Math.pow(height / 100, 2)).toFixed(2));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getBMIMessage = (bmi: number): string => {
  const category = getBMICategory(bmi);
  switch (category) {
    case 'Underweight': return '⚠️ Your BMI suggests you may be underweight. Consider consulting a healthcare provider.';
    case 'Normal weight': return '✅ Your BMI is within the healthy range. Keep up the good work!';
    case 'Overweight': return '⚡ Your BMI suggests you may benefit from a healthy weight loss plan.';
    case 'Obese': return '🏥 Your BMI suggests consulting a healthcare provider for a personalized plan.';
    default: return '';
  }
};

export const calculateBMR = (weight: number, height: number, age: number, sex: string): number => {
  // Mifflin-St Jeor formula
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateDailyCalories = (
  weight: number, 
  height: number, 
  age: number, 
  sex: string, 
  activity: string, 
  goal: string
): number => {
  const bmr = calculateBMR(weight, height, age, sex);
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const maintenanceCalories = bmr * (activityMultipliers[activity as keyof typeof activityMultipliers] || 1.2);
  
  // Goal adjustments
  switch (goal) {
    case 'lose': return Math.round(maintenanceCalories - 500); // 1 lb per week loss
    case 'gain': return Math.round(maintenanceCalories + 500); // 1 lb per week gain
    case 'maintain': return Math.round(maintenanceCalories);
    default: return Math.round(maintenanceCalories);
  }
};

export const getCalorieMessage = (calories: number, goal: string): string => {
  switch (goal) {
    case 'lose': return `🔥 To lose weight steadily, aim for ${calories} calories per day.`;
    case 'gain': return `💪 To gain weight healthily, aim for ${calories} calories per day.`;
    case 'maintain': return `⚖️ To maintain your current weight, aim for ${calories} calories per day.`;
    default: return `🎯 Your daily calorie target is ${calories} calories.`;
  }
};

// Body composition calculations
export const calculateWaistToHipRatio = (waist: number, hip: number): number => {
  return Number((waist / hip).toFixed(3));
};

export const getWaistToHipRiskLevel = (ratio: number, sex: string): string => {
  if (sex === 'male') {
    if (ratio < 0.95) return 'Low risk';
    if (ratio <= 1.0) return 'Moderate risk';
    return 'High risk';
  } else {
    if (ratio < 0.80) return 'Low risk';
    if (ratio <= 0.85) return 'Moderate risk';
    return 'High risk';
  }
};

export const getWaistToHipMessage = (ratio: number, sex: string): string => {
  const risk = getWaistToHipRiskLevel(ratio, sex);
  switch (risk) {
    case 'Low risk': return '✅ Your waist-to-hip ratio suggests a low health risk.';
    case 'Moderate risk': return '⚠️ Your waist-to-hip ratio suggests moderate health risk.';
    case 'High risk': return '🚨 Your waist-to-hip ratio suggests higher health risk. Consider consulting a healthcare provider.';
    default: return '';
  }
};

export const calculateBodyFat = (
  waist: number, 
  hip: number, 
  neck: number, 
  height: number, 
  sex: string
): number => {
  // US Navy method
  if (sex === 'male') {
    const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    return Number(Math.max(0, Math.min(50, bodyFat)).toFixed(1));
  } else {
    const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    return Number(Math.max(0, Math.min(50, bodyFat)).toFixed(1));
  }
};

export const getBodyFatMessage = (bodyFat: number, sex: string): string => {
  if (sex === 'male') {
    if (bodyFat < 6) return '⚠️ Very low body fat. This may not be healthy.';
    if (bodyFat < 14) return '🏃 Athletic body fat range. Excellent fitness level!';
    if (bodyFat < 18) return '💪 Good body fat range. You\'re in great shape!';
    if (bodyFat < 25) return '👍 Average body fat range. Room for improvement.';
    return '🎯 Higher body fat range. Consider a fitness plan.';
  } else {
    if (bodyFat < 16) return '⚠️ Very low body fat. This may not be healthy.';
    if (bodyFat < 20) return '🏃 Athletic body fat range. Excellent fitness level!';
    if (bodyFat < 25) return '💪 Good body fat range. You\'re in great shape!';
    if (bodyFat < 32) return '👍 Average body fat range. Room for improvement.';
    return '🎯 Higher body fat range. Consider a fitness plan.';
  }
};

// localStorage utilities
export const saveWaterIntake = (data: WaterIntakeData): void => {
  localStorage.setItem('waterIntake', JSON.stringify(data));
};

export const loadWaterIntake = (): WaterIntakeData | null => {
  const data = localStorage.getItem('waterIntake');
  return data ? JSON.parse(data) : null;
};

export const saveDailyCalories = (data: DailyCaloriesData): void => {
  localStorage.setItem('dailyCalories', JSON.stringify(data));
};

export const loadDailyCalories = (): DailyCaloriesData | null => {
  const data = localStorage.getItem('dailyCalories');
  return data ? JSON.parse(data) : null;
};

export const saveBodyComposition = (data: BodyCompositionData): void => {
  localStorage.setItem('bodyComposition', JSON.stringify(data));
};

export const loadBodyComposition = (): BodyCompositionData | null => {
  const data = localStorage.getItem('bodyComposition');
  return data ? JSON.parse(data) : null;
};

export const resetProgressData = (): void => {
  localStorage.removeItem('waterIntake');
  localStorage.removeItem('dailyCalories');
  localStorage.removeItem('bodyComposition');
};

export const isNewDay = (lastUpdated: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return lastUpdated !== today;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};