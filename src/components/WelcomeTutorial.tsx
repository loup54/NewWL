
import React, { useState } from 'react';
import { Play, FileText, Target, BarChart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WelcomeTutorialProps {
  onStartTour: () => void;
  onSkip: () => void;
}

export const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({
  onStartTour,
  onSkip
}) => {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: 'Document Analysis',
      description: 'Upload and analyze any text document for meaningful keywords and themes'
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: 'Smart Keyword Tracking',
      description: 'Track any custom keywords with visual highlighting'
    },
    {
      icon: <BarChart className="w-6 h-6 text-purple-500" />,
      title: 'Professional Reports',
      description: 'Generate detailed analytics and export to PDF, Word, or Excel formats'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      title: 'Document Comparison',
      description: 'Compare multiple documents side-by-side for comprehensive analysis'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to WordLens Insight Engine
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The intelligent document analysis tool for tracking meaningful themes and generating professional insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Play className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ready to get started?</h3>
          </div>
          
          <p className="text-gray-600 max-w-md mx-auto">
            Take a quick interactive tour to learn how to use WordLens effectively, or jump right in and start analyzing!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button onClick={onStartTour} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Interactive Tour
            </Button>
            <Button variant="outline" onClick={onSkip}>
              Skip Tour & Explore
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Badge variant="outline" className="text-xs">
              💡 Tip: Press Ctrl+? anytime for keyboard shortcuts
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
