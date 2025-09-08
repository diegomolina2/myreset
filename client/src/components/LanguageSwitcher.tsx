import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useTranslation();

  const languages = [
    { code: 'en-NG', flag: '🇳🇬', name: 'English (Nigeria)' },
    { code: 'en-ZA', flag: '🇿🇦', name: 'English (South Africa)' },
    { code: 'en-KE', flag: '🇰🇪', name: 'English (Kenya)' },
    { code: 'en-GH', flag: '🇬🇭', name: 'English (Ghana)' },
    { code: 'fr-CI', flag: '🇨🇮', name: 'Français (Côte d\'Ivoire)' }
  ];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    // Force page reload to apply language changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Current: {languages.find(l => l.code === currentLanguage)?.name || 'English (Nigeria)'}
      </div>
      
      <div className="grid gap-2">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage === language.code ? 'default' : 'outline'}
            onClick={() => handleLanguageChange(language.code)}
            className="w-full justify-start"
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </Button>
        ))}
      </div>
    </div>
  );
}