'use client';

import { AppShell } from '@/components/app-shell';
import { SignOutButton } from '@/components/sign-out-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePromptSetting } from '@/hooks/usePromptSetting';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/auth-js';
import { CheckCircle2, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SettingsPage() {
  const [promptSaved, setPromptSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const promptSaveTimeoutRef = useRef<number | null>(null);
  const settingsSaveTimeoutRef = useRef<number | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
  const isAuthenticated = Boolean(user);

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

  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const applyUser = (user: SupabaseUser) => {
      setUser(user);
      setSettings((previous) => {
        const nextName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          previous.name;
        return {
          ...previous,
          email: user.email ?? previous.email,
          name: nextName,
        };
      });
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) {
        return;
      }
      if (user) {
        lastUserIdRef.current = user.id;
        applyUser(user);
      } else {
        setUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }
      const nextUser = session?.user ?? null;
      if (nextUser) {
        if (nextUser.id !== lastUserIdRef.current) {
          lastUserIdRef.current = nextUser.id;
        }
        applyUser(nextUser);
      } else {
        lastUserIdRef.current = null;
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handlePromptSave = () => {
    if (!user) {
      return false;
    }

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
    if (!user) {
      return;
    }

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
    <AppShell>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 space-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-secondary">Workbench</p>
          <h1 className="text-[2.5rem] font-light leading-tight text-foreground">Settings</h1>
          <p className="text-base leading-relaxed text-secondary">
            Manage prompts, preferences, and the practical details that keep refining calm.
          </p>
        </div>

        <div className="space-y-6">
          {/* Prompt Configuration */}
          <Card className="border border-border bg-card/85">
            <CardHeader>
              <div className="flex items-center gap-3">
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
                  className="text-base leading-relaxed"
                  disabled={!isAuthenticated}
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                This prompt guides the AI&apos;s behavior when refining your sentences.
              </p>
              {!isAuthenticated ? (
                <p className="text-sm font-medium leading-relaxed text-amber-600">
                  Sign in to make this prompt truly yours—we’ll remember your guidance so every refinement stays aligned with
                  the value you deliver.
                </p>
              ) : null}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setPromptDraft(defaultPrompt)}
                  className="w-full sm:w-auto border-border font-sans text-[0.75rem] uppercase tracking-[0.3em] text-secondary hover:text-foreground"
                  disabled={!isAuthenticated}
                >
                  Reset to Default
                </Button>
                <Button
                  type="button"
                  size="default"
                  onClick={handlePromptSave}
                  disabled={!isPromptDirty || !isAuthenticated}
                  className="w-full sm:w-auto px-8 font-sans text-[0.75rem] uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-50"
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
          <Card className="border border-border bg-card/85">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold leading-relaxed">Account</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Sign out of Refiner on this device.
                </CardDescription>
              </div>
              <SignOutButton />
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-secondary">
              Signing out will end your current session and return you to the login screen.
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
