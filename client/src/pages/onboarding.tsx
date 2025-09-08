import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { UserProfile } from "../types";

const TOTAL_STEPS = 8;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { updateUserProfile, dispatch } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    targetWeight: 0,
    gender: "other",
    exerciseLevel: "sedentary",
    diet: [],
    language: "en-NG",
  });

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietToggle = (diet: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      diet: checked
        ? [...(prev.diet || []), diet]
        : (prev.diet || []).filter((d) => d !== diet),
    }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      updateUserProfile(profile as UserProfile);
      dispatch({ type: "SET_ONBOARDED", payload: true });
      setLocation("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.name && profile.name.length > 0;
      case 2:
        return profile.age && profile.age > 0;
      case 3:
        return profile.height && profile.height > 0;
      case 4:
        return profile.weight && profile.weight > 0;
      case 5:
        return profile.targetWeight && profile.targetWeight > 0;
      case 6:
        return profile.gender !== undefined;
      case 7:
        return profile.exerciseLevel !== undefined;
      case 8:
        return true; // Diet preferences are optional
      default:
        return false;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="name">{t("onboarding.fields.name")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("onboarding.fields.namePlaceholder")}
              value={profile.name || ""}
              onChange={(e) => updateProfile("name", e.target.value)}
              className="rounded-2xl"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="age">{t("onboarding.fields.age")}</Label>
            <Input
              id="age"
              type="number"
              placeholder={t("onboarding.fields.agePlaceholder")}
              value={profile.age || ""}
              onChange={(e) =>
                updateProfile("age", parseInt(e.target.value) || 0)
              }
              className="rounded-2xl"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="height">{t("onboarding.fields.height")}</Label>
            <Input
              id="height"
              type="number"
              placeholder={t("onboarding.fields.heightPlaceholder")}
              value={profile.height || ""}
              onChange={(e) =>
                updateProfile("height", parseInt(e.target.value) || 0)
              }
              className="rounded-2xl"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label htmlFor="weight">{t("onboarding.fields.weight")}</Label>
            <Input
              id="weight"
              type="number"
              placeholder={t("onboarding.fields.weightPlaceholder")}
              value={profile.weight || ""}
              onChange={(e) =>
                updateProfile("weight", parseInt(e.target.value) || 0)
              }
              className="rounded-2xl"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Label htmlFor="targetWeight">
              {t("onboarding.fields.targetWeight")}
            </Label>
            <Input
              id="targetWeight"
              type="number"
              placeholder={t("onboarding.fields.targetWeightPlaceholder")}
              value={profile.targetWeight || ""}
              onChange={(e) =>
                updateProfile("targetWeight", parseInt(e.target.value) || 0)
              }
              className="rounded-2xl"
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Label>{t("onboarding.fields.gender")}</Label>
            <Select
              value={profile.gender}
              onValueChange={(value) => updateProfile("gender", value)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  {t("onboarding.fields.genderOptions.male")}
                </SelectItem>
                <SelectItem value="female">
                  {t("onboarding.fields.genderOptions.female")}
                </SelectItem>
                <SelectItem value="other">
                  {t("onboarding.fields.genderOptions.other")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <Label>{t("onboarding.fields.exerciseLevel")}</Label>
            <Select
              value={profile.exerciseLevel}
              onValueChange={(value) => updateProfile("exerciseLevel", value)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">
                  {t("onboarding.fields.exerciseOptions.sedentary")}
                </SelectItem>
                <SelectItem value="light">
                  {t("onboarding.fields.exerciseOptions.light")}
                </SelectItem>
                <SelectItem value="moderate">
                  {t("onboarding.fields.exerciseOptions.moderate")}
                </SelectItem>
                <SelectItem value="active">
                  {t("onboarding.fields.exerciseOptions.active")}
                </SelectItem>
                <SelectItem value="very_active">
                  {t("onboarding.fields.exerciseOptions.very_active")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 8:
        const dietOptions = [
          "none",
          "vegetarian",
          "vegan",
          "halal",
          "kosher",
          "gluten_free",
          "dairy_free",
        ];
        return (
          <div className="space-y-4">
            <Label>{t("onboarding.fields.diet")}</Label>
            <div className="space-y-3">
              {dietOptions.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet}
                    checked={(profile.diet || []).includes(diet)}
                    onCheckedChange={(checked) =>
                      handleDietToggle(diet, checked as boolean)
                    }
                  />
                  <Label htmlFor={diet} className="text-sm">
                    {t(`onboarding.fields.dietOptions.${diet}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                {t("onboarding.title")}
              </CardTitle>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("onboarding.step", {
                  current: currentStep,
                  total: TOTAL_STEPS,
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="w-full h-2 mb-6" />
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {renderStepContent()}

              <div className="flex space-x-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 py-4 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("onboarding.back")}
                  </Button>
                )}

                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-medium transition-colors duration-200"
                >
                  {currentStep === TOTAL_STEPS
                    ? t("onboarding.finish")
                    : t("onboarding.continue")}
                  {currentStep < TOTAL_STEPS && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
