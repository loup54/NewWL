
import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Lightbulb, Target, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isFirstVisit,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to WordLens!',
      description: 'Analyze documents for meaningful themes like respect, inclusion, and diversity. Let\'s take a quick tour!',
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />
    },
    {
      id: 'upload',
      title: 'Upload Your Document',
      description: 'Start by uploading any text document. We support PDF, Word, and plain text files.',
      icon: <Target className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'keywords',
      title: 'Manage Keywords',
      description: 'Add custom keywords or use our predefined categories. Keywords will be highlighted in your document.',
      icon: <BarChart3 className="w-6 h-6 text-green-500" />
    },
    {
      id: 'export',
      title: 'Export Analysis',
      description: 'Generate professional reports in PDF, Word, or Excel format with charts and detailed analytics.',
      icon: <Download className="w-6 h-6 text-purple-500" />
    }
  ];

  useEffect(() => {
    if (isFirstVisit) {
      setIsVisible(true);
    }
  }, [isFirstVisit]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">
            Step {currentStep + 1} of {tourSteps.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {step.icon}
            <h3 className="text-lg font-semibold">{step.title}</h3>
          </div>

          <p className="text-gray-600">{step.description}</p>

          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < tourSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
