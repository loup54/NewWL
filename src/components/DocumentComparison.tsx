<<<<<<< HEAD
import React from 'react';
import { DocumentComparison as DocumentComparisonType } from '../types/document-analysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
=======

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DocumentData, Keyword } from '@/types';
import { Card } from '@/components/ui/card';
>>>>>>> 78b4fbc6a05d82465a5c297dd289cc2a68d61a59

interface DocumentComparisonProps {
  comparison: DocumentComparisonType;
}

export function DocumentComparison({ comparison }: DocumentComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Theme Similarity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Similarity</CardTitle>
          <CardDescription>Comparison of themes between documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Similarity:</span>
              <Progress value={comparison.themeSimilarity.score * 100} className="w-48" />
              <span className="text-sm text-gray-500">
                {Math.round(comparison.themeSimilarity.score * 100)}%
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Shared Themes:</h4>
              <div className="flex flex-wrap gap-2">
                {comparison.themeSimilarity.sharedThemes.map((theme, index) => (
                  <Badge key={index} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Unique to Document 1:</h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.themeSimilarity.uniqueThemes.doc1.map((theme, index) => (
                    <Badge key={index} variant="outline">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Unique to Document 2:</h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.themeSimilarity.uniqueThemes.doc2.map((theme, index) => (
                    <Badge key={index} variant="outline">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Overlap Section */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Analysis</CardTitle>
          <CardDescription>Comparison of keyword usage between documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Shared Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {comparison.keywordOverlap.shared.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                    <span className="ml-1 text-xs">
                      ({comparison.keywordOverlap.frequencyComparison[keyword].doc1} vs{' '}
                      {comparison.keywordOverlap.frequencyComparison[keyword].doc2})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Unique to Document 1:</h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.keywordOverlap.uniqueToDoc1.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                      <span className="ml-1 text-xs">
                        ({comparison.keywordOverlap.frequencyComparison[keyword].doc1})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Unique to Document 2:</h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.keywordOverlap.uniqueToDoc2.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                      <span className="ml-1 text-xs">
                        ({comparison.keywordOverlap.frequencyComparison[keyword].doc2})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readability Comparison Section */}
      <Card>
        <CardHeader>
          <CardTitle>Readability Comparison</CardTitle>
          <CardDescription>Comparison of document complexity and readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReadabilityComparison
              label="Flesch-Kincaid Grade Level"
              doc1={comparison.readabilityComparison.doc1.fleschKincaidGrade}
              doc2={comparison.readabilityComparison.doc2.fleschKincaidGrade}
              max={20}
            />
            <ReadabilityComparison
              label="Flesch Reading Ease"
              doc1={comparison.readabilityComparison.doc1.fleschReadingEase}
              doc2={comparison.readabilityComparison.doc2.fleschReadingEase}
              max={100}
            />
            <ReadabilityComparison
              label="Coleman-Liau Index"
              doc1={comparison.readabilityComparison.doc1.colemanLiauIndex}
              doc2={comparison.readabilityComparison.doc2.colemanLiauIndex}
              max={20}
            />
            <ReadabilityComparison
              label="Automated Readability Index"
              doc1={comparison.readabilityComparison.doc1.automatedReadabilityIndex}
              doc2={comparison.readabilityComparison.doc2.automatedReadabilityIndex}
              max={20}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadabilityComparison({
  label,
  doc1,
  doc2,
  max,
}: {
  label: string;
  doc1: number;
  doc2: number;
  max: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <div className="flex gap-4">
          <span className="text-blue-600">Doc 1: {doc1.toFixed(1)}</span>
          <span className="text-green-600">Doc 2: {doc2.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Progress value={(doc1 / max) * 100} className="w-full" />
        <Progress value={(doc2 / max) * 100} className="w-full" />
      </div>
    </div>
  );
}
