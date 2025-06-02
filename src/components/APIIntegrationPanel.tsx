
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { integrationHelpers } from '@/utils/apiIntegrations';
import { Webhook, MessageSquare, Zap, Send, Globe } from 'lucide-react';

export const APIIntegrationPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [integrationData, setIntegrationData] = useState({
    slack: { webhook: '', message: '' },
    discord: { webhook: '', content: '' },
    zapier: { webhook: '', data: '{}' },
    webhook: { url: '', payload: '{}' },
  });

  const handleInputChange = (service: string, field: string, value: string) => {
    setIntegrationData(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const testIntegration = async (service: string) => {
    setIsLoading(true);
    try {
      let result;
      
      switch (service) {
        case 'slack':
          if (!integrationData.slack.webhook || !integrationData.slack.message) {
            throw new Error('Please fill in both webhook URL and message');
          }
          result = await integrationHelpers.slack(
            integrationData.slack.webhook,
            integrationData.slack.message
          );
          break;
          
        case 'discord':
          if (!integrationData.discord.webhook || !integrationData.discord.content) {
            throw new Error('Please fill in both webhook URL and content');
          }
          result = await integrationHelpers.discord(
            integrationData.discord.webhook,
            integrationData.discord.content
          );
          break;
          
        case 'zapier':
          if (!integrationData.zapier.webhook) {
            throw new Error('Please fill in webhook URL');
          }
          const zapierData = JSON.parse(integrationData.zapier.data || '{}');
          result = await integrationHelpers.zapier(
            integrationData.zapier.webhook,
            zapierData
          );
          break;
          
        case 'webhook':
          if (!integrationData.webhook.url) {
            throw new Error('Please fill in webhook URL');
          }
          const webhookPayload = JSON.parse(integrationData.webhook.payload || '{}');
          result = await integrationHelpers.webhook(
            integrationData.webhook.url,
            webhookPayload
          );
          break;
          
        default:
          throw new Error('Unknown service');
      }

      if (result.success) {
        toast({
          title: "Integration Test Successful",
          description: `${service} integration is working correctly.`,
        });
      } else {
        throw new Error(result.error || 'Integration failed');
      }
    } catch (error) {
      toast({
        title: "Integration Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="w-6 h-6" />
          API Integrations
        </h2>
        <Badge variant="secondary">Third-party Services</Badge>
      </div>

      <Tabs defaultValue="slack" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="slack">Slack</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="zapier">Zapier</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="slack" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Slack Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slack-webhook">Webhook URL</Label>
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={integrationData.slack.webhook}
                  onChange={(e) => handleInputChange('slack', 'webhook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="slack-message">Test Message</Label>
                <Textarea
                  id="slack-message"
                  placeholder="Hello from WordLens!"
                  value={integrationData.slack.message}
                  onChange={(e) => handleInputChange('slack', 'message', e.target.value)}
                />
              </div>
              <Button
                onClick={() => testIntegration('slack')}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Slack Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discord Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discord-webhook">Webhook URL</Label>
                <Input
                  id="discord-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={integrationData.discord.webhook}
                  onChange={(e) => handleInputChange('discord', 'webhook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="discord-content">Test Content</Label>
                <Textarea
                  id="discord-content"
                  placeholder="Hello from WordLens!"
                  value={integrationData.discord.content}
                  onChange={(e) => handleInputChange('discord', 'content', e.target.value)}
                />
              </div>
              <Button
                onClick={() => testIntegration('discord')}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Discord Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zapier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Zapier Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="zapier-webhook">Webhook URL</Label>
                <Input
                  id="zapier-webhook"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={integrationData.zapier.webhook}
                  onChange={(e) => handleInputChange('zapier', 'webhook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zapier-data">Test Data (JSON)</Label>
                <Textarea
                  id="zapier-data"
                  placeholder='{"message": "Hello from WordLens!", "user": "admin"}'
                  value={integrationData.zapier.data}
                  onChange={(e) => handleInputChange('zapier', 'data', e.target.value)}
                />
              </div>
              <Button
                onClick={() => testIntegration('zapier')}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Zapier Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Generic Webhook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhook"
                  value={integrationData.webhook.url}
                  onChange={(e) => handleInputChange('webhook', 'url', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="webhook-payload">Payload (JSON)</Label>
                <Textarea
                  id="webhook-payload"
                  placeholder='{"event": "test", "data": {"message": "Hello"}}'
                  value={integrationData.webhook.payload}
                  onChange={(e) => handleInputChange('webhook', 'payload', e.target.value)}
                />
              </div>
              <Button
                onClick={() => testIntegration('webhook')}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Test integrations before using them in production
          </p>
          <p className="text-sm text-muted-foreground">
            • Store webhook URLs securely and never share them publicly
          </p>
          <p className="text-sm text-muted-foreground">
            • Monitor rate limits to avoid service disruptions
          </p>
          <p className="text-sm text-muted-foreground">
            • Use meaningful messages and data structures for better automation
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
