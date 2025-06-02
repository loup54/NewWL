
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to WordLens Insight Engine
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The intelligent document analysis tool for tracking meaningful themes and generating professional insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg border">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Ready to get started?</h3>
            </div>
            
            <p className="text-gray-700 max-w-md mx-auto leading-relaxed">
              Take a quick interactive tour to learn how to use WordLens effectively, or jump right in and start analyzing!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onStartTour} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg border border-blue-300"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Interactive Tour
              </Button>
              <Button 
                variant="outline" 
                onClick={onSkip}
                className="border-2 border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                Skip Tour & Explore
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs bg-white/60 border-gray-300">
                💡 Tip: Press Ctrl+? anytime for keyboard shortcuts
              </Badge>
            </div>
          </div>
        </Card>

        {/* Developer Attribution */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-sm text-gray-500 font-medium">
            Developed by{' '}
            <a 
              href="https://www.ourenglish.best" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
            >
              www.ourenglish.best
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
