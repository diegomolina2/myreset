import React from "react";
import { useApp } from "../contexts/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Lock, Play, Clock } from "lucide-react";
import { usePlanAccess } from "../hooks/usePlanAccess";
import { UpgradePopup } from "../components/UpgradePopup";
import coursesData from "../data/courses.json";
import { Course } from "../types";
import { useTranslation } from "../hooks/useTranslation";

const courses = coursesData as Course[];

export default function Courses() {
  const { state } = useApp();
  const { hasAccess: checkAccess } = usePlanAccess();
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const { t, currentLanguage } = useTranslation();

  const getCourseProgress = (courseId: string) => {
    const progressList = state.userData.courseProgress || [];

    const progress = progressList.find(
      (p) => p.courseId === courseId
    );

    if (!progress) return 0;

    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;

    // Calculate total lessons dynamically
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);

    return Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );
  };

  const handleCourseClick = (course: Course) => {
    if (!checkAccess(course.accessPlans)) {
      setShowUpgrade(true);
      return;
    }
    // Navegar para a página do curso
    window.location.hash = `#/course/${course.id}`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t('courses.title')}</h1>
        <p className="text-muted-foreground">
          {t('courses.subtitle')}
        </p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => {
          const hasAccessToCourse = checkAccess(course.accessPlans);
          const progress = getCourseProgress(course.id);

          return (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {!hasAccessToCourse && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {course.title[currentLanguage] || course.title['en-NG']}
                  {!hasAccessToCourse && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.description[currentLanguage] || course.description['en-NG']}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {course.modules.reduce((total, module) => total + module.lessons.length, 0)} {t('courses.lessons')}
                </div>
              </CardHeader>

              <CardContent>
                {hasAccessToCourse && progress > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{t('courses.progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <Button
                  onClick={() => handleCourseClick(course)}
                  className="w-full"
                  variant={hasAccessToCourse ? "default" : "outline"}
                >
                  {!hasAccessToCourse ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {t('courses.upgrade')}
                    </>
                  ) : progress > 0 ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {t('courses.continueCourse')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {t('courses.startCourse')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <UpgradePopup
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => {
          setShowUpgrade(false);
          // Aqui você pode adicionar lógica adicional após o upgrade se necessário
        }}
      />
    </div>
  );
}
