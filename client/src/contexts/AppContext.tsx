import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { UserData, AppState, Challenge } from "../types";
import {
  loadUserData,
  saveUserData,
  defaultUserData,
  checkAndUnlockBadges,
} from "../utils/storage";
import challengesData from "../data/challenges.json";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateUserProfile: (profile: Partial<UserData["userProfile"]>) => void;
  startChallenge: (challengeId: string) => void;
  restartChallenge: (challengeId: string) => void;
  completeTask: (challengeId: string, day: number, taskIndex: number) => void;
  uncompleteTask: (challengeId: string, day: number, taskIndex: number) => void;
  toggleFavorite: (type: "exercises" | "meals" | "quotes", id: string) => void;
  logWeight: (weight: number) => void;
  logMood: (mood: number) => void;
  logWater: (liters: number) => void;
  logCalories: (calories: number) => void;
  unlockBadge: (badgeId: string) => void;
  importCSVData: (
    csvData: any[],
  ) => Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    message?: string;
  }>;
}

type AppAction =
  | { type: "SET_USER_DATA"; payload: UserData }
  | { type: "UPDATE_USER_PROFILE"; payload: Partial<UserData["userProfile"]> }
  | { type: "SET_LANGUAGE"; payload: "en-NG" | "fr-CI" }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_ONBOARDED"; payload: boolean }
  | { type: "START_CHALLENGE"; payload: string }
  | { type: "RESTART_CHALLENGE"; payload: string }
  | {
      type: "COMPLETE_TASK";
      payload: { challengeId: string; day: number; taskIndex: number };
    }
  | {
      type: "UNCOMPLETE_TASK";
      payload: { challengeId: string; day: number; taskIndex: number };
    }
  | {
      type: "TOGGLE_FAVORITE";
      payload: { type: "exercises" | "meals" | "quotes"; id: string };
    }
  | { type: "LOG_WEIGHT"; payload: number }
  | { type: "LOG_MOOD"; payload: number }
  | { type: "LOG_WATER"; payload: number }
  | { type: "LOG_CALORIES"; payload: number }
  | { type: "UNLOCK_BADGE"; payload: string };

const initialState: AppState = {
  userData: defaultUserData,
  currentLanguage: "en-NG",
  isDarkMode: false,
  isOnboarded: false,
  currentChallenge: undefined,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER_DATA":
      return { ...state, userData: action.payload };

    case "UPDATE_USER_PROFILE":
      return {
        ...state,
        userData: {
          ...state.userData,
          userProfile: { ...state.userData.userProfile, ...action.payload },
        },
      };

    case "SET_LANGUAGE":
      return { ...state, currentLanguage: action.payload };

    case "SET_DARK_MODE":
      return { ...state, isDarkMode: action.payload };

    case "SET_ONBOARDED":
      return { ...state, isOnboarded: action.payload };

    case "START_CHALLENGE":
    case "RESTART_CHALLENGE": {
      const challengeTemplate = challengesData.find(
        (c) => c.id === action.payload,
      );
      if (!challengeTemplate) return state;

      const newChallenge: Challenge = {
        ...challengeTemplate,
        currentDay: 1,
        completedDays: [],
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        dailyTasks: challengeTemplate.dailyTasks.map((task) => ({
          ...task,
          completed: new Array(task.tasks.length).fill(false),
        })),
      };

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [action.payload]: newChallenge,
          },
        },
        currentChallenge: action.payload,
      };
    }

    case "COMPLETE_TASK": {
      const { challengeId, day, taskIndex } = action.payload;
      const challenge = state.userData.challenges[challengeId];
      if (!challenge) return state;

      const updatedChallenge = { ...challenge };
      const dayTask = updatedChallenge.dailyTasks.find((t) => t.day === day);
      if (dayTask) {
        dayTask.completed[taskIndex] = true;

        const allTasksCompleted = dayTask.completed.every((c) => c);
        if (
          allTasksCompleted &&
          !updatedChallenge.completedDays.includes(day)
        ) {
          updatedChallenge.completedDays.push(day);
          updatedChallenge.currentDay = Math.min(
            day + 1,
            updatedChallenge.days,
          );
        }
      }

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [challengeId]: updatedChallenge,
          },
        },
      };
    }

    case "UNCOMPLETE_TASK": {
      const { challengeId, day, taskIndex } = action.payload;
      const challenge = state.userData.challenges[challengeId];
      if (!challenge) return state;

      const updatedChallenge = { ...challenge };
      const dayTask = updatedChallenge.dailyTasks.find((t) => t.day === day);
      if (dayTask) {
        dayTask.completed[taskIndex] = false;
        if (updatedChallenge.completedDays.includes(day)) {
          updatedChallenge.completedDays =
            updatedChallenge.completedDays.filter((d) => d !== day);
        }
      }

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [challengeId]: updatedChallenge,
          },
        },
      };
    }

    case "TOGGLE_FAVORITE": {
      const { type, id } = action.payload;
      const currentFavorites = state.userData.favorites[type];
      const newFavorites = currentFavorites.includes(id)
        ? currentFavorites.filter((fav) => fav !== id)
        : [...currentFavorites, id];

      return {
        ...state,
        userData: {
          ...state.userData,
          favorites: {
            ...state.userData.favorites,
            [type]: newFavorites,
          },
        },
      };
    }

    case "LOG_WEIGHT": {
      const today = new Date().toISOString().split("T")[0];
      const updatedWeights = state.userData.weights.filter(
        (w) => w.date !== today,
      );
      updatedWeights.push({ date: today, weight: action.payload });

      return {
        ...state,
        userData: {
          ...state.userData,
          weights: updatedWeights,
        },
      };
    }

    case "LOG_MOOD": {
      const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();

    const moodLog = {
      date: today,
      mood: action.payload,
      time,
      timestamp: new Date().toISOString()
    };

    const existingLogs = state.userData.moodLogs || [];
    const updatedLogs = [...existingLogs, moodLog];

    const updatedUserData = {
      ...state.userData,
      moodLogs: updatedLogs
    };

    dispatch({
      type: 'SET_USER_DATA',
      payload: updatedUserData
    });

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

      return {
        ...state,
        userData: {
          ...state.userData,
          moods: updatedMoods,
        },
      };
    }

    case "LOG_WATER": {
      const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();

    const waterLog = {
      id: `water-${Date.now()}`,
      date: today,
      liters: action.payload,
      time,
      timestamp: new Date().toISOString()
    };

    const existingLogs = state.userData.waterLog || [];
    const updatedLogs = [...existingLogs, waterLog];

    const updatedUserData = {
      ...state.userData,
      waterLog: updatedLogs
    };

    dispatch({
      type: 'SET_USER_DATA',
      payload: updatedUserData
    });

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

      return {
        ...state,
        userData: {
          ...state.userData,
          waterLog: updatedWaterLog,
        },
      };
    }

    case "LOG_CALORIES": {
      const today = new Date().toISOString().split("T")[0];
      const updatedCaloriesLog = state.userData.caloriesLog.filter(
        (c) => c.date !== today,
      );
      updatedCaloriesLog.push({ date: today, calories: action.payload });

      return {
        ...state,
        userData: {
          ...state.userData,
          caloriesLog: updatedCaloriesLog,
        },
      };
    }

    case "UNLOCK_BADGE": {
      const existingBadge = state.userData.badges.find(
        (b) => b.id === action.payload,
      );
      if (existingBadge) return state;

      const newBadge = {
        id: action.payload,
        name: action.payload,
        description: "",
        icon: "",
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };

      return {
        ...state,
        userData: {
          ...state.userData,
          badges: [...state.userData.badges, newBadge],
        },
      };
    }

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const userData = loadUserData();
    dispatch({ type: "SET_USER_DATA", payload: userData });

    if (userData.userProfile.name) {
      dispatch({ type: "SET_ONBOARDED", payload: true });
    }

    if (userData.userProfile.language) {
      dispatch({
        type: "SET_LANGUAGE",
        payload: userData.userProfile.language,
      });
    }
  }, []);

  useEffect(() => {
    saveUserData(state.userData);
  }, [state.userData]);

  const updateUserProfile = (profile: Partial<UserData["userProfile"]>) => {
    dispatch({ type: "UPDATE_USER_PROFILE", payload: profile });
  };

  const startChallenge = (challengeId: string) => {
    dispatch({ type: "START_CHALLENGE", payload: challengeId });
  };

  const restartChallenge = (challengeId: string) => {
    dispatch({ type: "RESTART_CHALLENGE", payload: challengeId });
  };

  const completeTask = useCallback(
    (challengeId: string, day: number, taskIndex: number) => {
      dispatch({
        type: "COMPLETE_TASK",
        payload: { challengeId, day, taskIndex },
      });
      checkAndUnlockBadges(state.userData, dispatch);
    },
    [state.userData],
  );

  const uncompleteTask = (
    challengeId: string,
    day: number,
    taskIndex: number,
  ) => {
    dispatch({
      type: "UNCOMPLETE_TASK",
      payload: { challengeId, day, taskIndex },
    });
  };

  const toggleFavorite = (
    type: "exercises" | "meals" | "quotes",
    id: string,
  ) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: { type, id } });
  };

  const logWeight = (weight: number) => {
    dispatch({ type: "LOG_WEIGHT", payload: weight });
  };

  const logMood = (mood: number) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();

    const moodLog = {
      date: today,
      mood,
      time,
      timestamp: new Date().toISOString()
    };

    const existingLogs = state.userData.moodLogs || [];
    const updatedLogs = [...existingLogs, moodLog];

    const updatedUserData = {
      ...state.userData,
      moodLogs: updatedLogs
    };

    dispatch({
      type: 'SET_USER_DATA',
      payload: updatedUserData
    });

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const logWater = (liters: number) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();

    const waterLog = {
      id: `water-${Date.now()}`,
      date: today,
      liters,
      time,
      timestamp: new Date().toISOString()
    };

    const existingLogs = state.userData.waterLog || [];
    const updatedLogs = [...existingLogs, waterLog];

    const updatedUserData = {
      ...state.userData,
      waterLog: updatedLogs
    };

    dispatch({
      type: 'SET_USER_DATA',
      payload: updatedUserData
    });

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const logCalories = (calories: number) => {
    dispatch({ type: "LOG_CALORIES", payload: calories });
  };

  const unlockBadge = (badgeId: string) => {
    dispatch({ type: "UNLOCK_BADGE", payload: badgeId });
  };

  const importCSVData = async (csvData: any[]) => {
    return {
      success: true,
      imported: 0,
      skipped: 0,
      message: "Not implemented",
    };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        updateUserProfile,
        startChallenge,
        restartChallenge,
        completeTask,
        uncompleteTask,
        toggleFavorite,
        logWeight,
        logMood,
        logWater,
        logCalories,
        unlockBadge,
        importCSVData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

const initialUserData: UserData = {
  personalInfo: {
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  },
  preferences: {
    language: 'en-NG',
    theme: 'light'
  },
  onboardingCompleted: false,
  activePlan: 1,
  weightLogs: [],
  waterLogs: [],
  moodLogs: [],
  exerciseLogs: [],
  mealLogs: [],
  measurements: [],
  challengeProgress: [],
  courseProgress: [],
  lessonProgress: [],
  badges: []
};