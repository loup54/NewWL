
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, FileText, BarChart3 } from 'lucide-react';
import { Keyword, DocumentData } from '@/pages/Index';

interface AnalyticsDashboardProps {
  keywords: Keyword[];
  document: DocumentData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  keywords,
  document
}) => {
  const totalOccurrences = keywords.reduce((sum, keyword) => sum + keyword.count, 0);
  const topKeyword = keywords.reduce((max, keyword) => 
    keyword.count > max.count ? keyword : max, keywords[0] || { word: 'None', count: 0 }
  );

  // Calculate keyword density
  const documentWords = document?.content ? document.content.trim().split(/\s+/).length : 0;
  const keywordDensity = documentWords > 0 ? ((totalOccurrences / documentWords) * 100) : 0;

  const chartData = keywords
    .filter(k => k.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const pieData = keywords
    .filter(k => k.count > 0)
    .map(keyword => ({
      name: keyword.word,
      value: keyword.count,
      color: keyword.color
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Matches</p>
              <p className="text-2xl font-bold text-blue-800">{totalOccurrences}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Top Keyword</p>
              <p className="text-lg font-bold text-green-800 truncate">{topKeyword.word}</p>
              <p className="text-sm text-green-600">{topKeyword.count} occurrences</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Keyword Density</p>
              <p className="text-2xl font-bold text-purple-800">{keywordDensity.toFixed(2)}%</p>
              <p className="text-sm text-purple-600">of total words</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Keyword Frequency</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="word" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Keywords List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">All Keywords</h4>
        <div className="space-y-1">
          {keywords.map((keyword) => {
            const density = documentWords > 0 ? ((keyword.count / documentWords) * 100) : 0;
            return (
              <div key={keyword.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: keyword.color }}
                  />
                  <span className="text-gray-700">{keyword.word}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-medium">{keyword.count}</span>
                  <span className="text-xs text-gray-400">({density.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
