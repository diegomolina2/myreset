export interface PlanData {
  planId: number;
  startDate: string;
  expirationDate: string;
  isActive: boolean;
}

export interface Plan {
  id: number;
  name: string;
  duration: number; // dias; -1 = ilimitado
  password: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 1,
    name: "Kickstart",
    duration: 7,
    password: "kick2024",
    features: ["Acesso básico", "7 dias de duração"],
  },
  {
    id: 2,
    name: "Momentum",
    duration: 30,
    password: "momentum2024",
    features: ["Acesso intermediário", "30 dias de duração"],
  },
  {
    id: 3,
    name: "Thrive",
    duration: 90,
    password: "thrive2024",
    features: ["Acesso avançado", "90 dias de duração"],
  },
  {
    id: 4,
    name: "Total",
    duration: -1, // ilimitado
    password: "total2024",
    features: ["Acesso completo", "Sem limitação de tempo"],
  },
];

export const savePlanData = (planData: PlanData): void => {
  try {
    localStorage.setItem("userPlan", JSON.stringify(planData));
  } catch (error) {
    console.error("Failed to save plan data:", error);
  }
};

export const loadPlanData = (): PlanData | null => {
  try {
    const stored = localStorage.getItem("userPlan");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load plan data:", error);
  }
  return null;
};

export const activatePlan = (planId: number, password: string): boolean => {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || plan.password !== password) {
    return false;
  }

  const startDate = new Date();
  const expirationDate =
    plan.duration === -1
      ? new Date(2099, 11, 31)
      : new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

  const planData: PlanData = {
    planId,
    startDate: startDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    isActive: true,
  };

  savePlanData(planData);
  return true;
};

export const isAccessExpired = (): boolean => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return true;
  }

  const expirationDate = new Date(planData.expirationDate);
  return new Date() > expirationDate;
};

export const hasAccessToContent = (content: any): boolean => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive || isAccessExpired()) {
    return false;
  }

  if (!content.accessPlans || content.accessPlans.length === 0) {
    return true;
  }

  return content.accessPlans.includes(planData.planId);
};

export const getCurrentPlan = (): Plan | null => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return null;
  }

  return PLANS.find((p) => p.id === planData.planId) || null;
};

export const getRemainingDays = (): number => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return 0;
  }

  const plan = PLANS.find((p) => p.id === planData.planId);
  if (!plan || plan.duration === -1) {
    return -1;
  }

  const expirationDate = new Date(planData.expirationDate);
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

export const deactivatePlan = (): void => {
  localStorage.removeItem("userPlan");
};
