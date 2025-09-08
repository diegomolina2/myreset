import { useState, useEffect } from "react";
import {
  isAccessExpired,
  getCurrentPlan,
  getRemainingDays,
  Plan,
} from "../utils/planManager";

// agora retornamos uma função que aceita os planos do curso
export const usePlanAccess = () => {
  const [isValid, setIsValid] = useState(!isAccessExpired());
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(getCurrentPlan());
  const [remainingDays, setRemainingDays] = useState(getRemainingDays());

  useEffect(() => {
    const checkAccess = () => {
      const expired = isAccessExpired();
      setIsValid(!expired);
      setCurrentPlan(getCurrentPlan());
      setRemainingDays(getRemainingDays());
    };

    checkAccess();
    const interval = setInterval(checkAccess, 60000); // check every minute

    return () => clearInterval(interval);
  }, []);

  const hasAccess = (requiredPlans: number[]): boolean => {
    if (!isValid) return false;
    if (!requiredPlans || requiredPlans.length === 0) return true;

    // se o plano atual está entre os planos exigidos
    return requiredPlans.includes(currentPlan?.id || 0);
  };

  return {
    hasAccess,
    currentPlan,
    remainingDays,
    refreshAccess: () => {
      setIsValid(!isAccessExpired());
      setCurrentPlan(getCurrentPlan());
      setRemainingDays(getRemainingDays());
    },
  };
};
