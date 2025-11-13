'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usePromptSetting } from '@/hooks/usePromptSetting';
import { AlertCircle, Bell, CheckCircle2, Palette, Save, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SettingsPage() {
  const [promptSaved, setPromptSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const promptSaveTimeoutRef = useRef<number | null>(null);
  const settingsSaveTimeoutRef = useRef<number | null>(null);
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    language: 'en-US',
    theme: 'light',
    notifications: true,
    emailNotifications: false,
    saveHistory: true,
  });
  // TODO: Replace localStorage-backed prompt persistence with database storage.
  const { prompt, setPrompt, defaultPrompt } = usePromptSetting();
  const [promptDraft, setPromptDraft] = useState(prompt);
  const isPromptDirty = promptDraft !== prompt;

  useEffect(() => {
    setPromptDraft(prompt);
  }, [prompt]);

  useEffect(() => {
    return () => {
      if (promptSaveTimeoutRef.current) {
        window.clearTimeout(promptSaveTimeoutRef.current);
      }
      if (settingsSaveTimeoutRef.current) {
        window.clearTimeout(settingsSaveTimeoutRef.current);
      }
    };
  }, []);

  const handlePromptSave = () => {
    const nextPrompt = promptDraft.trim().length > 0 ? promptDraft : defaultPrompt;
    const shouldShowSaved = isPromptDirty || nextPrompt !== prompt;

    setPrompt(nextPrompt);
    setPromptDraft(nextPrompt);

    if (shouldShowSaved) {
      setPromptSaved(true);
      if (promptSaveTimeoutRef.current) {
        window.clearTimeout(promptSaveTimeoutRef.current);
      }
      promptSaveTimeoutRef.current = window.setTimeout(() => {
        setPromptSaved(false);
        promptSaveTimeoutRef.current = null;
      }, 3000);
    }

    return shouldShowSaved;
  };

  const handleSettingsSave = () => {
    handlePromptSave();
    setSettingsSaved(true);
    if (settingsSaveTimeoutRef.current) {
      window.clearTimeout(settingsSaveTimeoutRef.current);
    }
    settingsSaveTimeoutRef.current = window.setTimeout(() => {
      setSettingsSaved(false);
      settingsSaveTimeoutRef.current = null;
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold leading-snug text-gray-800 mb-2">Settings</h1>
        <p className="text-base leading-relaxed text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Prompt Configuration */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-2xl font-semibold leading-relaxed">AI Prompt</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Customize how the AI refines your sentences.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-semibold">
                Refinement Prompt
              </Label>
              <Textarea
                id="prompt"
                value={promptDraft}
                onChange={(event) => setPromptDraft(event.target.value)}
                rows={8}
                className="text-base leading-relaxed bg-white border-slate-200 text-slate-900"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              This prompt guides the AI&apos;s behavior when refining your sentences.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setPromptDraft(defaultPrompt)}
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Reset to Default
              </Button>
              <Button
                type="button"
                size="default"
                onClick={handlePromptSave}
                disabled={!isPromptDirty}
                className="w-full sm:w-auto bg-primary text-primary-foreground shadow-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed sm:min-w-[140px]"
              >
                {promptSaved && !isPromptDirty ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Prompt
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-2xl font-semibold leading-relaxed">Profile</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Update your personal information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {settings.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="text-base leading-relaxed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="text-base leading-relaxed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-2xl font-semibold leading-relaxed">
                  Preferences
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Customize your app experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-semibold">
                Language
              </Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger id="language" className="text-base leading-relaxed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm font-semibold">
                Theme
              </Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger id="theme" className="text-base leading-relaxed">
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
              <div className="space-y-1">
                <Label htmlFor="save-history" className="text-sm font-semibold">
                  Save Conversion History
                </Label>
                <p className="text-sm leading-relaxed text-gray-500">
                  Automatically save your sentence conversions
                </p>
              </div>
              <Switch
                id="save-history"
                checked={settings.saveHistory}
                onCheckedChange={(checked) => setSettings({ ...settings, saveHistory: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-2xl font-semibold leading-relaxed">
                  Notifications
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Manage how you receive notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-sm font-semibold">
                  Push Notifications
                </Label>
                <p className="text-sm leading-relaxed text-gray-500">
                  Receive notifications in the app
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-sm font-semibold">
                  Email Notifications
                </Label>
                <p className="text-sm leading-relaxed text-gray-500">
                  Receive updates via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold leading-relaxed">
              Account Management
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Manage your account security and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Danger Zone</p>
              <Button
                variant="outline"
                className="w-full sm:w-auto text-accent-error border-accent-error hover:bg-accent-error/10"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleSettingsSave}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          >
            <Save className="w-4 h-4" />
            {settingsSaved ? 'Settings Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
