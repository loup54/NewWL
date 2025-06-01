
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  format: 'pdf' | 'word' | 'excel' | 'csv' | 'json';
  includeAnalytics: boolean;
  includeComparison: boolean;
  enabled: boolean;
}

export const ExportScheduler: React.FC = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ExportSchedule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ExportSchedule>>({
    name: '',
    frequency: 'weekly',
    time: '09:00',
    format: 'pdf',
    includeAnalytics: true,
    includeComparison: false,
    enabled: true
  });

  const handleCreateSchedule = () => {
    if (!newSchedule.name) {
      toast({
        title: "Error",
        description: "Please enter a schedule name",
        variant: "destructive"
      });
      return;
    }

    const schedule: ExportSchedule = {
      id: Date.now().toString(),
      name: newSchedule.name,
      frequency: newSchedule.frequency || 'weekly',
      time: newSchedule.time || '09:00',
      format: newSchedule.format || 'pdf',
      includeAnalytics: newSchedule.includeAnalytics || false,
      includeComparison: newSchedule.includeComparison || false,
      enabled: newSchedule.enabled || true
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      frequency: 'weekly',
      time: '09:00',
      format: 'pdf',
      includeAnalytics: true,
      includeComparison: false,
      enabled: true
    });
    setIsCreating(false);

    toast({
      title: "Schedule Created",
      description: `Export schedule "${schedule.name}" has been created successfully.`
    });
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "Export schedule has been deleted."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export Scheduling</h2>
          <p className="text-muted-foreground">Automate your document exports</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          New Schedule
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Export Schedule</CardTitle>
            <CardDescription>Set up automated exports for your documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  placeholder="e.g., Weekly Report"
                  value={newSchedule.name || ''}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newSchedule.frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setNewSchedule(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSchedule.time || '09:00'}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select value={newSchedule.format} onValueChange={(value: 'pdf' | 'word' | 'excel' | 'csv' | 'json') => 
                  setNewSchedule(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="word">Word Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Export Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-analytics"
                  checked={newSchedule.includeAnalytics}
                  onCheckedChange={(checked) => 
                    setNewSchedule(prev => ({ ...prev, includeAnalytics: !!checked }))}
                />
                <Label htmlFor="include-analytics">Include Analytics Dashboard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-comparison"
                  checked={newSchedule.includeComparison}
                  onCheckedChange={(checked) => 
                    setNewSchedule(prev => ({ ...prev, includeComparison: !!checked }))}
                />
                <Label htmlFor="include-comparison">Include Document Comparison</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateSchedule}>Create Schedule</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No export schedules created yet</p>
            </CardContent>
          </Card>
        ) : (
          schedules.map(schedule => (
            <Card key={schedule.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={schedule.enabled}
                        onCheckedChange={() => toggleSchedule(schedule.id)}
                      />
                      <div>
                        <h3 className="font-medium">{schedule.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {schedule.frequency} at {schedule.time} • {schedule.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSchedule(schedule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
