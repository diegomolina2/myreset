
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Settings as SettingsIcon, Save, User, Ruler, Weight, Calendar, Globe, Download, Upload, RefreshCw, Crown, Clock, Key, AlertTriangle } from 'lucide-react';
import { DailyWeightLogger } from '../components/DailyWeightLogger';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { CSVImport } from '../components/CSVImport';
import { exportAllDataAsCSV } from '../utils/csvExport';
import { resetProgressData } from '../utils/progressCalculations';
import { clearUserData } from '../utils/storage';
import { getCurrentPlan, getRemainingDays, loadPlanData, deactivatePlan, isAccessExpired } from '../utils/planManager';
import { PlanActivationDialog } from '../components/PlanActivation';
import { Badge } from '../components/ui/badge';

export default function Settings() {
  const { t } = useTranslation();
  const { state, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    sex: '',
    activityLevel: '',
    goal: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());
  const [remainingDays, setRemainingDays] = useState(getRemainingDays());
  const [planData, setPlanData] = useState(loadPlanData());
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updatePlanInfo = () => {
      setCurrentPlan(getCurrentPlan());
      setRemainingDays(getRemainingDays());
      setPlanData(loadPlanData());
      
      if (planData && !isAccessExpired()) {
        const expirationDate = new Date(planData.expirationDate);
        const now = new Date();
        const diff = expirationDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft('Expirado');
        }
      }
    };

    updatePlanInfo();
    const interval = setInterval(updatePlanInfo, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [planData]);

  useEffect(() => {
    // Load existing user data from localStorage and state
    const savedUserData = localStorage.getItem('userData');
    let userData = state.userData;
    
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        userData = { ...userData, ...parsedData };
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }
    
    // Also check userProfile from state for onboarding data
    const userProfile = state.userData?.userProfile;
    
    setFormData({
      name: userData.name || userProfile?.name || '',
      age: userData.age?.toString() || userProfile?.age?.toString() || '',
      weight: userData.weight?.toString() || userProfile?.weight?.toString() || '',
      height: userData.height?.toString() || userProfile?.height?.toString() || '',
      sex: userData.sex || userProfile?.gender || '',
      activityLevel: userData.activityLevel || userProfile?.exerciseLevel || '',
      goal: userData.goal || userProfile?.goal || ''
    });
  }, [state.userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        sex: formData.sex,
        activityLevel: formData.activityLevel,
        goal: formData.goal
      };
      
      // Save to context
      updateUserProfile(updatedData);
      
      // Save to localStorage for persistence
      const existingData = localStorage.getItem('userData');
      let userData = {};
      if (existingData) {
        try {
          userData = JSON.parse(existingData);
        } catch (error) {
          console.error('Error parsing existing user data:', error);
        }
      }
      
      const mergedData = { ...userData, ...updatedData };
      localStorage.setItem('userData', JSON.stringify(mergedData));
      
      // Show success message (you can integrate with your toast system)
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetProgressData();
      clearUserData();
      deactivatePlan();
      alert('All data has been reset successfully!');
      window.location.reload();
    }
  };

  const handlePlanActivation = () => {
    setCurrentPlan(getCurrentPlan());
    setRemainingDays(getRemainingDays());
    setPlanData(loadPlanData());
  };

  const handleDeactivatePlan = () => {
    if (confirm('Tem certeza que deseja desativar seu plano atual?')) {
      deactivatePlan();
      setCurrentPlan(null);
      setRemainingDays(0);
      setPlanData(null);
      alert('Plano desativado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Update your profile information
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Plan Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Informações do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {currentPlan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Plano ativo
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    Ativo
                  </Badge>
                </div>

                {remainingDays !== -1 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Tempo Restante
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {timeLeft}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {remainingDays} dias restantes
                    </p>
                  </div>
                )}

                {remainingDays === -1 && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Acesso Ilimitado
                      </span>
                    </div>
                  </div>
                )}

                {remainingDays <= 3 && remainingDays > 0 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Seu plano expira em breve!
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recursos Inclusos:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <PlanActivationDialog onActivation={handlePlanActivation} />
                  <Button 
                    onClick={handleDeactivatePlan}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    Desativar Plano
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Nenhum plano ativo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Ative um plano para acessar os desafios
                </p>
                <PlanActivationDialog onActivation={handlePlanActivation} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Physical Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Target Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Target weight in kg"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Height in cm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="w-5 h-5" />
              Daily Weight Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DailyWeightLogger />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Goals & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language / Langue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => exportAllDataAsCSV(state.userData)}
                variant="outline"
                className="w-full text-green-600 hover:text-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data as CSV
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data from CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CSVImport />
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={handleResetData}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
