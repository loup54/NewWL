
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DocumentData, Keyword } from '@/types';
import { Card } from '@/components/ui/card';

interface DocumentComparisonProps {
  documents: DocumentData[];
  keywords: Keyword[];
  keywordCounts: Record<string, Record<string, number>>;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  documents,
  keywords,
  keywordCounts
}) => {
  const comparisonData = useMemo(() => {
    return keywords.map(keyword => {
      const data: any = { keyword: keyword.word };
      documents.forEach((doc, index) => {
        data[`doc${index}`] = keywordCounts[doc.filename]?.[keyword.word] || 0;
      });
      return data;
    });
  }, [keywords, documents, keywordCounts]);

  const documentStats = useMemo(() => {
    return documents.map(doc => {
      const totalWords = doc.content.trim().split(/\s+/).length;
      const totalKeywords = keywords.reduce((sum, keyword) => {
        return sum + (keywordCounts[doc.filename]?.[keyword.word] || 0);
      }, 0);
      
      return {
        filename: doc.filename,
        totalWords,
        totalKeywords,
        keywordDensity: totalWords > 0 ? (totalKeywords / totalWords * 100) : 0
      };
    });
  }, [documents, keywords, keywordCounts]);

  const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];

  if (documents.length < 2) {
    return (
      <div className="text-center text-gray-500 py-8">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Upload at least 2 documents to see comparison</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium truncate">{stat.filename}</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Words: {stat.totalWords.toLocaleString()}</div>
                <div>Keywords: {stat.totalKeywords}</div>
                <div>Density: {stat.keywordDensity.toFixed(2)}%</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Keyword Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="keyword" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              {documents.map((doc, index) => (
                <Bar 
                  key={index}
                  dataKey={`doc${index}`} 
                  name={doc.filename}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Keyword</th>
                {documents.map((doc, index) => (
                  <th key={index} className="text-center p-2">{doc.filename}</th>
                ))}
                <th className="text-center p-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map(keyword => {
                const counts = documents.map(doc => keywordCounts[doc.filename]?.[keyword.word] || 0);
                const trend = counts.length > 1 ? 
                  (counts[counts.length - 1] > counts[0] ? 'up' : 
                   counts[counts.length - 1] < counts[0] ? 'down' : 'same') : 'same';
                
                return (
                  <tr key={keyword.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: keyword.color }}
                        />
                        <span>{keyword.word}</span>
                      </div>
                    </td>
                    {counts.map((count, index) => (
                      <td key={index} className="text-center p-2">{count}</td>
                    ))}
                    <td className="text-center p-2">
                      {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />}
                      {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                      {trend === 'same' && <Minus className="w-4 h-4 text-gray-500 mx-auto" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
