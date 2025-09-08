// CSV Export utilities for NaijaReset app data
import { UserData } from '../types';
import { 
  WaterIntakeData, 
  DailyCaloriesData, 
  BodyCompositionData,
  loadWaterIntake,
  loadDailyCalories,
  loadBodyComposition
} from './progressCalculations';

export const exportAllDataAsCSV = (userData: UserData): void => {
  try {
    // Load progression data from localStorage
    const waterData = loadWaterIntake();
    const caloriesData = loadDailyCalories();
    const bodyData = loadBodyComposition();

    // Prepare CSV content
    let csvContent = '';
    
    // Add header
    csvContent += 'NaijaReset - Complete Health Data Export\n';
    csvContent += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

    // User Profile Section
    csvContent += 'USER PROFILE\n';
    csvContent += 'Field,Value\n';
    csvContent += `Name,"${userData.userProfile.name}"\n`;
    csvContent += `Age,${userData.userProfile.age}\n`;
    csvContent += `Height (cm),${userData.userProfile.height}\n`;
    csvContent += `Weight (kg),${userData.userProfile.weight}\n`;
    csvContent += `Target Weight (kg),${userData.userProfile.targetWeight}\n`;
    csvContent += `Gender,"${userData.userProfile.gender}"\n`;
    csvContent += `Exercise Level,"${userData.userProfile.exerciseLevel}"\n`;
    csvContent += `Diet Preferences,"${userData.userProfile.diet.join(', ')}"\n`;
    csvContent += `Language,"${userData.userProfile.language}"\n\n`;

    // Weight Tracking Section
    csvContent += 'WEIGHT TRACKING\n';
    csvContent += 'Date,Weight (kg)\n';
    userData.weights.forEach(weight => {
      csvContent += `${weight.date},${weight.weight}\n`;
    });
    csvContent += '\n';

    // Mood Tracking Section
    csvContent += 'MOOD TRACKING\n';
    csvContent += 'Date,Mood\n';
    userData.moods.forEach(mood => {
      csvContent += `${mood.date},"${mood.mood}"\n`;
    });
    csvContent += '\n';

    // Water Intake Section
    csvContent += 'WATER INTAKE TRACKING\n';
    csvContent += 'Date,Liters\n';
    userData.waterLog.forEach(water => {
      csvContent += `${water.date},${water.liters}\n`;
    });
    csvContent += '\n';

    // Calories Tracking Section
    csvContent += 'CALORIES TRACKING\n';
    csvContent += 'Date,Calories\n';
    userData.caloriesLog.forEach(calories => {
      csvContent += `${calories.date},${calories.calories}\n`;
    });
    csvContent += '\n';

    // Progressive Health Data Section
    if (waterData) {
      csvContent += 'WATER INTAKE CALCULATOR\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Weight (kg),${waterData.weight}\n`;
      csvContent += `Activity Level,"${waterData.activity}"\n`;
      csvContent += `Goal,"${waterData.goal}"\n`;
      csvContent += `Recommended Daily (ml),${waterData.recommendedMl}\n`;
      csvContent += `Logged Today (ml),${waterData.loggedMlToday}\n`;
      csvContent += `Last Updated,"${waterData.lastUpdated}"\n\n`;
    }

    if (caloriesData) {
      csvContent += 'DAILY CALORIES & BMI DATA\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Weight (kg),${caloriesData.weight}\n`;
      csvContent += `Height (cm),${caloriesData.height}\n`;
      csvContent += `Age,${caloriesData.age}\n`;
      csvContent += `Sex,"${caloriesData.sex}"\n`;
      csvContent += `Activity Level,"${caloriesData.activity}"\n`;
      csvContent += `Goal,"${caloriesData.goal}"\n`;
      csvContent += `BMI,${caloriesData.BMI}\n`;
      csvContent += `Recommended Calories,${caloriesData.recommendedCalories}\n`;
      csvContent += `Last Updated,"${caloriesData.lastUpdated}"\n\n`;
    }

    if (bodyData) {
      csvContent += 'BODY COMPOSITION DATA\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Waist (cm),${bodyData.waist}\n`;
      csvContent += `Hip (cm),${bodyData.hip}\n`;
      csvContent += `Neck (cm),${bodyData.neck}\n`;
      csvContent += `Height (cm),${bodyData.height}\n`;
      csvContent += `Sex,"${bodyData.sex}"\n`;
      csvContent += `Waist-to-Hip Ratio,${bodyData.waistToHipRatio}\n`;
      csvContent += `Body Fat Percentage,${bodyData.bodyFatPercentage}%\n`;
      csvContent += `Last Updated,"${bodyData.lastUpdated}"\n\n`;
    }

    // Measurements Section
    csvContent += 'BODY MEASUREMENTS\n';
    csvContent += 'Date,Waist (cm),Hips (cm),Chest (cm),Arms (cm),Thighs (cm)\n';
    userData.measurements.forEach(measurement => {
      csvContent += `${measurement.date},${measurement.waist || ''},${measurement.hips || ''},${measurement.chest || ''},${measurement.arms || ''},${measurement.thighs || ''}\n`;
    });
    csvContent += '\n';

    // Badges Section
    csvContent += 'BADGES & ACHIEVEMENTS\n';
    csvContent += 'Badge Name,Description,Unlocked,Date Unlocked\n';
    userData.badges.forEach(badge => {
      csvContent += `"${badge.name}","${badge.description}",${badge.isUnlocked ? 'Yes' : 'No'},"${badge.unlockedAt || ''}"\n`;
    });
    csvContent += '\n';

    // Challenges Section
    csvContent += 'CHALLENGES\n';
    csvContent += 'Challenge Name,Description,Days,Current Day,Completed Days,Status,Start Date\n';
    Object.values(userData.challenges).forEach(challenge => {
      csvContent += `"${challenge.name}","${challenge.description}",${challenge.days},${challenge.currentDay},"${challenge.completedDays.join(', ')}",${challenge.isActive ? 'Active' : 'Inactive'},"${challenge.startDate || ''}"\n`;
    });
    csvContent += '\n';

    // Exercise History Section
    csvContent += 'EXERCISE HISTORY\n';
    csvContent += 'Exercise ID,Date,Duration (minutes),Completed\n';
    userData.exerciseHistory.forEach(exercise => {
      csvContent += `"${exercise.exerciseId}","${exercise.date}",${exercise.duration},${exercise.completed ? 'Yes' : 'No'}\n`;
    });
    csvContent += '\n';

    // Meal History Section
    csvContent += 'MEAL HISTORY\n';
    csvContent += 'Meal ID,Date,Meal Type\n';
    userData.mealHistory.forEach(meal => {
      csvContent += `"${meal.mealId}","${meal.date}","${meal.mealType}"\n`;
    });
    csvContent += '\n';

    // Favorites Section
    csvContent += 'FAVORITES\n';
    csvContent += 'Type,Item IDs\n';
    csvContent += `Exercises,"${userData.favorites.exercises.join(', ')}"\n`;
    csvContent += `Meals,"${userData.favorites.meals.join(', ')}"\n`;
    csvContent += `Quotes,"${userData.favorites.quotes.join(', ')}"\n\n`;

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `naija-reset-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('CSV export completed successfully');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Error exporting data. Please try again.');
  }
};

export const exportProgressDataOnlyAsCSV = (): void => {
  try {
    const waterData = loadWaterIntake();
    const caloriesData = loadDailyCalories();
    const bodyData = loadBodyComposition();

    let csvContent = '';
    
    // Add header
    csvContent += 'NaijaReset - Progress Data Export\n';
    csvContent += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

    if (waterData) {
      csvContent += 'WATER INTAKE CALCULATOR\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Weight (kg),${waterData.weight}\n`;
      csvContent += `Activity Level,"${waterData.activity}"\n`;
      csvContent += `Goal,"${waterData.goal}"\n`;
      csvContent += `Recommended Daily (ml),${waterData.recommendedMl}\n`;
      csvContent += `Logged Today (ml),${waterData.loggedMlToday}\n`;
      csvContent += `Last Updated,"${waterData.lastUpdated}"\n\n`;
    }

    if (caloriesData) {
      csvContent += 'DAILY CALORIES & BMI DATA\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Weight (kg),${caloriesData.weight}\n`;
      csvContent += `Height (cm),${caloriesData.height}\n`;
      csvContent += `Age,${caloriesData.age}\n`;
      csvContent += `Sex,"${caloriesData.sex}"\n`;
      csvContent += `Activity Level,"${caloriesData.activity}"\n`;
      csvContent += `Goal,"${caloriesData.goal}"\n`;
      csvContent += `BMI,${caloriesData.BMI}\n`;
      csvContent += `Recommended Calories,${caloriesData.recommendedCalories}\n`;
      csvContent += `Last Updated,"${caloriesData.lastUpdated}"\n\n`;
    }

    if (bodyData) {
      csvContent += 'BODY COMPOSITION DATA\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Waist (cm),${bodyData.waist}\n`;
      csvContent += `Hip (cm),${bodyData.hip}\n`;
      csvContent += `Neck (cm),${bodyData.neck}\n`;
      csvContent += `Height (cm),${bodyData.height}\n`;
      csvContent += `Sex,"${bodyData.sex}"\n`;
      csvContent += `Waist-to-Hip Ratio,${bodyData.waistToHipRatio}\n`;
      csvContent += `Body Fat Percentage,${bodyData.bodyFatPercentage}%\n`;
      csvContent += `Last Updated,"${bodyData.lastUpdated}"\n\n`;
    }

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `naija-reset-progress-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Progress CSV export completed successfully');
  } catch (error) {
    console.error('Error exporting progress CSV:', error);
    alert('Error exporting progress data. Please try again.');
  }
};