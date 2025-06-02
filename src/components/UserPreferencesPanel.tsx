
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Settings, Palette, Globe, Bell, Shield, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const UserPreferencesPanel: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences, isLoading } = useUserPreferences();

  const handlePreferenceChange = (key: string, value: any) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      updatePreferences({ [key]: value });
    } else {
      const [parentKey, childKey] = keys;
      updatePreferences({
        [parentKey]: {
          ...preferences[parentKey as keyof typeof preferences],
          [childKey]: value,
        },
      });
    }
  };

  const handleReset = () => {
    resetPreferences();
    toast({
      title: "Preferences Reset",
      description: "All preferences have been reset to default values.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          User Preferences
        </h2>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset to Defaults
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => handlePreferenceChange('theme', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="documentView">Document View</Label>
              <Select
                value={preferences.documentView}
                onValueChange={(value) => handlePreferenceChange('documentView', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => handlePreferenceChange('language', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(value) => handlePreferenceChange('notifications.email', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={(value) => handlePreferenceChange('notifications.push', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="in-app-notifications">In-App Notifications</Label>
              <Switch
                id="in-app-notifications"
                checked={preferences.notifications.inApp}
                onCheckedChange={(value) => handlePreferenceChange('notifications.inApp', value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Analytics</Label>
              <Switch
                id="analytics"
                checked={preferences.privacy.analytics}
                onCheckedChange={(value) => handlePreferenceChange('privacy.analytics', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="crash-reports">Crash Reports</Label>
              <Switch
                id="crash-reports"
                checked={preferences.privacy.crashReports}
                onCheckedChange={(value) => handlePreferenceChange('privacy.crashReports', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto Save</Label>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(value) => handlePreferenceChange('autoSave', value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={preferences.accessibility.highContrast}
                onCheckedChange={(value) => handlePreferenceChange('accessibility.highContrast', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <Switch
                id="reduced-motion"
                checked={preferences.accessibility.reducedMotion}
                onCheckedChange={(value) => handlePreferenceChange('accessibility.reducedMotion', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={preferences.accessibility.fontSize}
                onValueChange={(value) => handlePreferenceChange('accessibility.fontSize', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
