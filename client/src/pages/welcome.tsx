import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { t, changeLanguage } = useTranslation();
  const { updateUserProfile } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const languages = [
    { code: "en-NG", name: "English (Nigeria)", flag: "🇳🇬" },
    { code: "en-ZA", name: "English (South Africa)", flag: "🇿🇦" },
    { code: "en-KE", name: "English (Kenya)", flag: "🇰🇪" },
    { code: "en-GH", name: "English (Ghana)", flag: "🇬🇭" },
    { code: "fr-CI", name: "Français (Côte d'Ivoire)", flag: "🇨🇮" },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      changeLanguage(selectedLanguage);
      updateUserProfile({ language: selectedLanguage as any });
      setLocation("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="animate-fadeIn">
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <CardContent className="space-y-6">
            {/* App Logo */}
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="NaijaReset Logo"
                className="w-24 h-24 object-contain rounded-full"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const container = target.parentElement!;
                  container.innerHTML = `
                    <div class="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                      <span class="text-white font-bold text-lg">NR</span>
                    </div>
                  `;
                }}
              />
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <h1 className="text-3xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                My Reset
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("welcome.subtitle")}
              </p>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-poppins font-semibold text-gray-800 dark:text-gray-100">
                {t("welcome.chooseLanguage")}
              </h2>

              <div className="space-y-4">
                <Select
                  onValueChange={handleLanguageSelect}
                  value={selectedLanguage}
                >
                  <SelectTrigger className="w-full py-4 px-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Select your language / Choisissez votre langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <span className="flex items-center space-x-3">
                          <span className="text-xl">{language.flag}</span>
                          <span>{language.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedLanguage}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {selectedLanguage
                    ? selectedLanguage.startsWith("fr")
                      ? "Continuer"
                      : "Continue"
                    : "Continue / Continuer"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
