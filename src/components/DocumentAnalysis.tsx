import React from 'react';
import { DocumentAnalysis as DocumentAnalysisType, Theme, KeywordMatch } from '../types/document-analysis';
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

interface DocumentAnalysisProps {
  analysis: DocumentAnalysisType;
}

export function DocumentAnalysis({ analysis }: DocumentAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Themes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Document Themes</CardTitle>
          <CardDescription>Key themes identified in the document</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {analysis.themes.map((theme, index) => (
              <ThemeItem key={index} theme={theme} />
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Keyword Matches Section */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Matches</CardTitle>
          <CardDescription>Instances of tracked keywords in the document</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {analysis.keywordMatches.map((match, index) => (
              <KeywordMatchItem key={index} match={match} />
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Readability Scores Section */}
      <Card>
        <CardHeader>
          <CardTitle>Readability Analysis</CardTitle>
          <CardDescription>Document complexity and readability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReadabilityScore
              label="Flesch-Kincaid Grade Level"
              value={analysis.readabilityScores.fleschKincaidGrade}
              max={20}
            />
            <ReadabilityScore
              label="Flesch Reading Ease"
              value={analysis.readabilityScores.fleschReadingEase}
              max={100}
            />
            <ReadabilityScore
              label="Coleman-Liau Index"
              value={analysis.readabilityScores.colemanLiauIndex}
              max={20}
            />
            <ReadabilityScore
              label="Automated Readability Index"
              value={analysis.readabilityScores.automatedReadabilityIndex}
              max={20}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeItem({ theme }: { theme: Theme }) {
  return (
    <AccordionItem value={theme.name}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <span>{theme.name}</span>
          <Badge variant="secondary">{theme.category}</Badge>
          <Progress value={theme.confidence} className="w-24" />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{theme.description}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium">Examples:</p>
            {theme.examples.map((example, index) => (
              <p key={index} className="text-sm text-gray-500 italic">
                "{example}"
              </p>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function KeywordMatchItem({ match }: { match: KeywordMatch }) {
  return (
    <AccordionItem value={match.keyword}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <span>{match.keyword}</span>
          <Badge variant="secondary">{match.frequency} matches</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {match.matches.map((m, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <p className="text-sm">
                <span className="font-medium">Context: </span>
                {m.context}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={m.type === 'exact' ? 'default' : 'secondary'}>
                  {m.type}
                </Badge>
                {m.similarity && (
                  <span className="text-sm text-gray-500">
                    Similarity: {Math.round(m.similarity * 100)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ReadabilityScore({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <Progress value={(value / max) * 100} className="w-full" />
    </div>
  );
} 