import { UserProfile } from '../types';

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateWaterNeeds = (weight: number, exerciseLevel: string): number => {
  let baseWater = weight * 0.035; // 35ml per kg
  
  switch (exerciseLevel) {
    case 'light':
      return baseWater * 1.1;
    case 'moderate':
      return baseWater * 1.2;
    case 'active':
      return baseWater * 1.3;
    case 'very_active':
      return baseWater * 1.4;
    default:
      return baseWater;
  }
};

export const calculateCalorieNeeds = (profile: UserProfile): number => {
  const { weight, height, age, gender, exerciseLevel } = profile;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  return Math.round(bmr * activityMultipliers[exerciseLevel]);
};

export const calculateWaistToHipRatio = (waist: number, hips: number): number => {
  return waist / hips;
};

export const getWaistToHipRiskLevel = (ratio: number, gender: string): string => {
  if (gender === 'male') {
    if (ratio < 0.9) return 'Low';
    if (ratio < 1.0) return 'Moderate';
    return 'High';
  } else {
    if (ratio < 0.8) return 'Low';
    if (ratio < 0.85) return 'Moderate';
    return 'High';
  }
};

export const estimateBodyFat = (bmi: number, age: number, gender: string): number => {
  // Deurenberg formula (rough estimation)
  let bodyFat: number;
  if (gender === 'male') {
    bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
  } else {
    bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
  }
  
  return Math.max(0, Math.round(bodyFat));
};

export const calculateWeightLossCalories = (currentWeight: number, targetWeight: number, weeksToGoal: number): number => {
  const weightDifference = currentWeight - targetWeight;
  const caloriesPerKg = 7700; // Approximate calories per kg of body weight
  const totalCaloriesNeeded = weightDifference * caloriesPerKg;
  const dailyCalorieDeficit = totalCaloriesNeeded / (weeksToGoal * 7);
  
  return Math.round(dailyCalorieDeficit);
};

export const getProgressPercentage = (current: number, start: number, target: number): number => {
  if (start === target) return 100;
  
  const totalProgress = Math.abs(target - start);
  const currentProgress = Math.abs(current - start);
  
  return Math.min(100, Math.round((currentProgress / totalProgress) * 100));
};

export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals);
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getWeeklyAverage = (data: Array<{ date: string; value: number }>, weeks: number = 4): number => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
  
  const recentData = data.filter(item => new Date(item.date) >= cutoffDate);
  
  if (recentData.length === 0) return 0;
  
  const sum = recentData.reduce((acc, item) => acc + item.value, 0);
  return sum / recentData.length;
};

export const getMonthlyAverage = (data: Array<{ date: string; value: number }>, months: number = 3): number => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  const recentData = data.filter(item => new Date(item.date) >= cutoffDate);
  
  if (recentData.length === 0) return 0;
  
  const sum = recentData.reduce((acc, item) => acc + item.value, 0);
  return sum / recentData.length;
};
