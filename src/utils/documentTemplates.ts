
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  icon: string;
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'hr-policy',
    name: 'HR Policy',
    description: 'Human Resources policies and procedures',
    category: 'Human Resources',
    keywords: ['respect', 'inclusion', 'diversity', 'harassment', 'discrimination', 'equality', 'workplace', 'conduct', 'ethics', 'compliance'],
    icon: 'Users'
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Team meetings and discussions',
    category: 'Meetings',
    keywords: ['action', 'decision', 'discussion', 'agreement', 'timeline', 'responsible', 'deadline', 'follow-up', 'objectives', 'outcomes'],
    icon: 'Calendar'
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Employee performance evaluations',
    category: 'Human Resources',
    keywords: ['performance', 'goals', 'achievements', 'improvement', 'feedback', 'development', 'skills', 'objectives', 'growth', 'excellence'],
    icon: 'TrendingUp'
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Software code review documentation',
    category: 'Development',
    keywords: ['quality', 'standards', 'security', 'performance', 'maintainability', 'testing', 'documentation', 'best-practices', 'refactoring', 'bugs'],
    icon: 'Code'
  },
  {
    id: 'project-report',
    name: 'Project Report',
    description: 'Project status and progress reports',
    category: 'Project Management',
    keywords: ['milestone', 'deliverable', 'timeline', 'budget', 'resources', 'risk', 'scope', 'stakeholder', 'progress', 'completion'],
    icon: 'FileText'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit',
    description: 'Regulatory compliance and audit documents',
    category: 'Compliance',
    keywords: ['compliance', 'regulation', 'audit', 'violation', 'corrective', 'preventive', 'risk', 'control', 'procedure', 'standard'],
    icon: 'Shield'
  }
];

export const getTemplatesByCategory = () => {
  const categories = documentTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, DocumentTemplate[]>);
  
  return categories;
};

export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return documentTemplates.find(template => template.id === id);
};
