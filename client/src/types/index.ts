export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  gender: 'male' | 'female' | 'other';
  exerciseLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  diet: string[];
  language: 'en-NG' | 'fr-CI';
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  days: number;
  dailyTasks: DailyTask[];
  currentDay: number;
  completedDays: number[];
  isActive: boolean;
  startDate?: string;
  accessPlans?: number[];
}

export interface DailyTask {
  day: number;
  tasks: string[];
  completed: boolean[];
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Light' | 'Moderate' | 'Advanced';
  duration?: string;
  reps?: string;
  rest: string;
  description?: string;
  isFavorite?: boolean;
  accessPlans?: number[];
}

export interface Meal {
  id: string;
  name: string | { [key: string]: string };
  description?: string | { [key: string]: string };
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cookingTime: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[] | { [key: string]: string[] };
  instructions: string[] | { [key: string]: string[] };
  image?: string;
  accessPlans?: number[];
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface MoodLog {
  date: string;
  mood: '😞' | '😐' | '🙂' | '😊' | '😄';
}

export interface WaterLog {
  id?: string;
  date: string;
  liters: number;
  time: string;
  timestamp: string;
}

export interface CaloriesLog {
  date: string;
  calories: number;
}

export interface Measurements {
  date: string;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Course {
  id: string;
  title: {
    'en-NG': string;
    'fr-CI': string;
  };
  description: {
    'en-NG': string;
    'fr-CI': string;
  };
  image: string;
  accessPlans: number[];
  totalLessons: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: {
    'en-NG': string;
    'fr-CI': string;
  };
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: {
    'en-NG': string;
    'fr-CI': string;
  };
  type: 'video' | 'text';
  duration: string;
  videoUrl?: string;
  description?: {
    'en-NG': string;
    'fr-CI': string;
  };
  content?: {
    text: {
      'en-NG': string;
      'fr-CI': string;
    };
    images?: string[];
  };
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentModule: string;
  currentLesson: string;
  startedAt: string;
  lastAccessedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface UserData {
  userProfile: UserProfile;
  challenges: Record<string, Challenge>;
  weights: WeightLog[];
  moods: MoodLog[];
  measurements: Measurements[];
  waterLog: WaterLog[];
  caloriesLog: CaloriesLog[];
  courseProgress: CourseProgress[];
  lessonProgress: LessonProgress[];
  badges: Badge[];
  favorites: {
    exercises: string[];
    meals: string[];
    quotes: string[];
  };
  exerciseHistory: Array<{
    exerciseId: string;
    date: string;
    duration: number;
    completed: boolean;
  }>;
  mealHistory: Array<{
    mealId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }>;
}

export interface AppState {
  userData: UserData;
  currentLanguage: 'en-NG' | 'fr-CI';
  isDarkMode: boolean;
  isOnboarded: boolean;
  currentChallenge?: string;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  toggleDarkMode: () => void;
  setLanguage: (language: 'en-NG' | 'fr-CI') => void;
  setOnboarded: () => void;
  startChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string, day: number) => void;
  restartChallenge: (challengeId: string) => void;
  updateUserProfile: (profileData: Partial<UserData>) => void;
  importCSVData: (csvData: any[]) => Promise<{ success: boolean; imported: number; skipped: number; message?: string }>;
}

export type AppAction =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LANGUAGE'; payload: 'en-NG' | 'fr-CI' }
  | { type: 'SET_ONBOARDED' }
  | { type: 'SET_USER_DATA'; payload: UserData }
  | { type: 'START_CHALLENGE'; payload: string }
  | { type: 'COMPLETE_CHALLENGE'; payload: { challengeId: string; day: number } }
  | { type: 'RESTART_CHALLENGE'; payload: string }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserData> }
  | { type: 'IMPORT_CSV_DATA'; payload: any[] };