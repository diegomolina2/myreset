
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import faqData from '../data/faq.json';

interface FAQItem {
  id: string;
  question: {
    [key: string]: string;
  };
  answer: {
    [key: string]: string;
  };
}

const faq = faqData as FAQItem[];

export default function FAQ() {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('faq.title')}</h1>
        </div>
        <p className="text-muted-foreground">
          {t('faq.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('faq.frequentQuestions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {faq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left">
                  {item.question[currentLanguage] || item.question['en-NG'] || 'Question'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer[currentLanguage] || item.answer['en-NG'] || 'Answer'}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
