
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ArrowLeft, Play, CheckCircle2, Clock, Video, FileText } from 'lucide-react';
import coursesData from '../data/courses.json';
import { Course, CourseProgress } from '../types';
import { RouteComponentProps } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';

const courses = coursesData as Course[];

interface CourseDetailsProps extends RouteComponentProps {
  params: { id: string };
}

export default function CourseDetails({ params }: CourseDetailsProps) {
  const { t, currentLanguage } = useTranslation();
  const { user, updateUser } = useApp();
  
  const course = courses.find(c => c.id === params.id);
  const courseProgress = user?.courseProgress?.[params.id];
  
  if (!course) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const getCourseName = () => {
    if (typeof course.name === 'string') {
      return course.name;
    }
    return course.name[currentLanguage] || course.name['en-NG'] || 'Course';
  };

  const getCourseDescription = () => {
    if (typeof course.description === 'string') {
      return course.description;
    }
    return course.description[currentLanguage] || course.description['en-NG'] || '';
  };

  const getLessonTitle = (lesson: any) => {
    if (typeof lesson.title === 'string') {
      return lesson.title;
    }
    return lesson.title[currentLanguage] || lesson.title['en-NG'] || 'Lesson';
  };

  const getLessonDescription = (lesson: any) => {
    if (typeof lesson.description === 'string') {
      return lesson.description;
    }
    return lesson.description?.[currentLanguage] || lesson.description?.['en-NG'] || '';
  };

  const startCourse = () => {
    if (!user) return;
    
    const newProgress: CourseProgress = {
      currentLessonId: course.lessons[0].id,
      completedLessons: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };
    
    updateUser({
      ...user,
      courseProgress: {
        ...user.courseProgress,
        [course.id]: newProgress
      }
    });
  };

  const continueCourse = () => {
    if (!user || !courseProgress) return;
    
    updateUser({
      ...user,
      courseProgress: {
        ...user.courseProgress,
        [course.id]: {
          ...courseProgress,
          lastAccessedAt: new Date().toISOString()
        }
      }
    });
  };

  const completedLessons = courseProgress?.completedLessons?.length || 0;
  const progressPercentage = (completedLessons / course.lessons.length) * 100;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">{getCourseName()}</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {course.lessons.length} {t('courses.lessons')}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('courses.progress')}: {Math.round(progressPercentage)}%
              </div>
            </div>
            
            <p className="text-muted-foreground">
              {getCourseDescription()}
            </p>
            
            <div className="flex gap-2">
              {!courseProgress ? (
                <Button onClick={startCourse} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {t('courses.startCourse')}
                </Button>
              ) : (
                <Button onClick={continueCourse} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {t('courses.continueCourse')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Course Content</h2>
          <Accordion type="single" collapsible>
            {course.lessons.map((lesson, index) => {
              const isCompleted = courseProgress?.completedLessons?.includes(lesson.id);
              const isCurrent = courseProgress?.currentLessonId === lesson.id;
              
              return (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isCurrent ? (
                        <Play className="w-5 h-5 text-blue-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">
                          {index + 1}. {getLessonTitle(lesson)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {lesson.type === 'video' ? (
                            <Video className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {getLessonDescription(lesson)}
                      </p>
                      <Button size="sm" variant="outline">
                        Start Lesson
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
