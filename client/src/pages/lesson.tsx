import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Video, FileText } from 'lucide-react';
import coursesData from '../data/courses.json';
import { Course, CourseProgress } from '../types';
import { RouteComponentProps } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';

const courses = coursesData as Course[];

interface LessonPageProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export default function LessonPage({ courseId, moduleId, lessonId }: LessonPageProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  const progress = state.userData.courseProgress.find(p => p.courseId === courseId);

  if (!course || !module || !lesson) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('Lesson not found')}</h1>
        <Button onClick={() => window.location.hash = '#/courses'}>
          {t('Back to Courses')}
        </Button>
      </div>
    );
  }

  const isCompleted = progress?.completedLessons.includes(lessonId) || false;

  const markAsCompleted = () => {
    if (isCompleted) return;

    // Update course progress
    let updatedCourseProgress;
    if (progress) {
      const updatedProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
        lastAccessedAt: new Date().toISOString()
      };
      updatedCourseProgress = state.userData.courseProgress.map(p => 
        p.courseId === courseId ? updatedProgress : p
      );
    } else {
      // Create new progress if it doesn't exist
      const newProgress = {
        courseId,
        completedLessons: [lessonId],
        currentModule: moduleId,
        currentLesson: lessonId,
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      };
      updatedCourseProgress = [...state.userData.courseProgress, newProgress];
    }

    // Update lesson progress
    const existingLessonProgress = state.userData.lessonProgress || [];
    const existingLesson = existingLessonProgress.find(
      lp => lp.lessonId === lessonId && lp.courseId === courseId
    );

    let updatedLessonProgress;
    if (existingLesson) {
      updatedLessonProgress = existingLessonProgress.map(lp =>
        lp.lessonId === lessonId && lp.courseId === courseId
          ? { ...lp, completed: true, completedAt: new Date().toISOString() }
          : lp
      );
    } else {
      const newLessonProgress = {
        lessonId,
        courseId,
        moduleId,
        completed: true,
        completedAt: new Date().toISOString()
      };
      updatedLessonProgress = [...existingLessonProgress, newLessonProgress];
    }

    // Save to localStorage and state
    const updatedUserData = {
      ...state.userData,
      courseProgress: updatedCourseProgress,
      lessonProgress: updatedLessonProgress
    };

    localStorage.setItem('naijaresetUserData', JSON.stringify(updatedUserData));

    dispatch({
      type: 'SET_USER_DATA',
      payload: updatedUserData
    });
  };

  const getNextLesson = () => {
    const allLessons: Array<{ moduleId: string; lessonId: string; lesson: any }> = [];

    course.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        allLessons.push({ moduleId: mod.id, lessonId: les.id, lesson: les });
      });
    });

    const currentIndex = allLessons.findIndex(l => l.lessonId === lessonId);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    const allLessons: Array<{ moduleId: string; lessonId: string; lesson: any }> = [];

    course.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        allLessons.push({ moduleId: mod.id, lessonId: les.id, lesson: les });
      });
    });

    const currentIndex = allLessons.findIndex(l => l.lessonId === lessonId);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();

  const goToNextLesson = () => {
    if (nextLesson) {
      // Update current lesson in progress
      if (progress) {
        const updatedProgress = {
          ...progress,
          currentModule: nextLesson.moduleId,
          currentLesson: nextLesson.lessonId,
          lastAccessedAt: new Date().toISOString()
        };

        const updatedCourseProgress = state.userData.courseProgress.map(p => 
          p.courseId === courseId ? updatedProgress : p
        );

        dispatch({
          type: 'SET_USER_DATA',
          payload: {
            ...state.userData,
            courseProgress: updatedCourseProgress
          }
        });
      }

      window.location.hash = `#/lesson/${courseId}/${nextLesson.moduleId}/${nextLesson.lessonId}`;
    }
  };

  const goToPrevLesson = () => {
    if (prevLesson) {
      window.location.hash = `#/lesson/${courseId}/${prevLesson.moduleId}/${prevLesson.lessonId}`;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Button
        variant="ghost"
        onClick={() => window.location.hash = `#/course/${courseId}`}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('Back to Course')}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{course.title}</span>
            <span>•</span>
            <span>{module.title}</span>
          </div>

          <CardTitle className="flex items-center gap-3">
            {lesson.type === 'video' ? (
              <Video className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-green-500" />
            )}
            {lesson.title}
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </CardTitle>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {lesson.duration}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {lesson.type === 'video' ? (
            <div className="space-y-4">
              <div className="aspect-video">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
              {lesson.description && (
                <p className="text-muted-foreground">{lesson.description}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {lesson.content?.text.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mb-4">{paragraph.slice(2)}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mb-3 mt-6">{paragraph.slice(3)}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{paragraph.slice(4)}</h3>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-6">{paragraph.slice(2)}</li>;
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <p key={index} className="font-semibold mb-2">{paragraph.slice(2, -2)}</p>;
                  }
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-4">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>

              {lesson.content?.images && lesson.content.images.length > 0 && (
                <div className="space-y-4">
                  {lesson.content.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Imagem da aula ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={goToPrevLesson}
                disabled={!prevLesson}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('Previous')}
              </Button>

              <Button
                variant="outline"
                onClick={goToNextLesson}
                disabled={!nextLesson}
              >
                {t('Next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Button
              onClick={markAsCompleted}
              disabled={isCompleted}
              className="sm:ml-auto"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t('Completed')}
                </>
              ) : (
                t('Mark as Completed')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}