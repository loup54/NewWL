
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, BookOpen, Target, Award, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Keyword, DocumentData } from '@/pages/Index';
import { calculateAdvancedStats, analyzeKeywordTrends } from '@/utils/advancedAnalytics';

interface EnhancedAnalyticsDashboardProps {
  keywords: Keyword[];
  document: DocumentData;
}

export const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  keywords,
  document
}) => {
  const advancedStats = useMemo(() => {
    if (!document?.content) return null;
    return calculateAdvancedStats(document.content);
  }, [document?.content]);

  const keywordTrends = useMemo(() => {
    if (!document?.content || !keywords.length) return [];
    return analyzeKeywordTrends(document.content, keywords);
  }, [document?.content, keywords]);

  const chartData = useMemo(() => {
    return keywords.map(keyword => ({
      name: keyword.word,
      count: keyword.count,
      density: keywordTrends.find(t => t.keyword === keyword.word)?.density || 0,
      color: keyword.color
    }));
  }, [keywords, keywordTrends]);

  const complexityLevel = useMemo(() => {
    if (!advancedStats) return 'Unknown';
    const score = advancedStats.complexityScore;
    if (score < 30) return 'Simple';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'Complex';
    return 'Very Complex';
  }, [advancedStats]);

  const readingLevel = useMemo(() => {
    if (!advancedStats) return 'Unknown';
    const avgWords = advancedStats.avgWordsPerSentence;
    if (avgWords < 15) return 'Easy';
    if (avgWords < 20) return 'Moderate';
    if (avgWords < 25) return 'Difficult';
    return 'Very Difficult';
  }, [advancedStats]);

  if (!advancedStats) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 text-center">No document loaded for analysis</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-lg font-semibold">{advancedStats.readingTime}m</div>
              <div className="text-xs text-gray-600">Reading Time</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-lg font-semibold">{advancedStats.complexityScore}/100</div>
              <div className="text-xs text-gray-600">Complexity</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-lg font-semibold">{advancedStats.avgWordsPerSentence}</div>
              <div className="text-xs text-gray-600">Avg Words/Sentence</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-lg font-semibold">{keywords.reduce((sum, k) => sum + k.count, 0)}</div>
              <div className="text-xs text-gray-600">Total Keywords</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reading Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reading Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Complexity Level</span>
              <Badge variant={advancedStats.complexityScore > 60 ? 'destructive' : 'default'}>
                {complexityLevel}
              </Badge>
            </div>
            <Progress value={advancedStats.complexityScore} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Reading Level</span>
              <Badge variant="outline">{readingLevel}</Badge>
            </div>
            <Progress value={(advancedStats.avgWordsPerSentence / 30) * 100} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Keyword Density Chart */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Keyword Density</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'density' ? `${value}%` : value,
                    name === 'density' ? 'Density' : 'Count'
                  ]}
                />
                <Bar dataKey="density" name="density">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Most Common Words */}
      {advancedStats.mostCommonWords.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Common Words</h3>
          <div className="grid grid-cols-2 gap-2">
            {advancedStats.mostCommonWords.slice(0, 10).map((word, index) => (
              <div key={word} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{word}</span>
                <Badge variant="outline" className="text-xs">
                  {advancedStats.wordFrequency[word]}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Document Structure */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Document Structure</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sentences:</span>
              <span className="font-medium">{advancedStats.totalSentences}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paragraphs:</span>
              <span className="font-medium">{advancedStats.totalParagraphs}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sentences/Paragraph:</span>
              <span className="font-medium">{advancedStats.avgSentencesPerParagraph}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Words:</span>
              <span className="font-medium">{Object.keys(advancedStats.wordFrequency).length}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
