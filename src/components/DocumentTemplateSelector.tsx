
import React, { useState } from 'react';
import { documentTemplates, getTemplatesByCategory, DocumentTemplate } from '@/utils/documentTemplates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, TrendingUp, Code, FileText, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentTemplateSelectorProps {
  onTemplateSelect: (template: DocumentTemplate) => void;
  onClose: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Users,
  Calendar,
  TrendingUp,
  Code,
  FileText,
  Shield
};

export const DocumentTemplateSelector: React.FC<DocumentTemplateSelectorProps> = ({
  onTemplateSelect,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = getTemplatesByCategory();
  const allCategories = Object.keys(categories);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    onTemplateSelect(template);
    toast.success(`Applied ${template.name} template with ${template.keywords.length} keywords`);
    onClose();
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? documentTemplates 
    : categories[selectedCategory] || [];

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Document Templates</h3>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {allCategories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => {
              const IconComponent = iconMap[template.icon] || FileText;
              
              return (
                <Card 
                  key={template.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      <Badge variant="secondary" className="text-xs mb-3">
                        {template.category}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {template.keywords.slice(0, 4).map(keyword => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {template.keywords.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.keywords.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
