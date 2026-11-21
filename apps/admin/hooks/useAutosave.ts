"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** `idle` = nothing changed since the page loaded; `saved` = the last change was saved. */
export type AutosaveStatus = "idle" | "saved" | "pending" | "saving" | "error";

interface AutosaveOptions {
  readonly enabled: boolean;
  readonly delay?: number;
}

/**
 * Save `value` a moment after it stops changing. Saves run one at a time and only the
 * newest value is sent. `value` must keep its identity between renders when unchanged
 * (memoize it). An edit still waiting when the component unmounts is saved right away,
 * and leaving the page while a change is unsaved asks the browser to confirm.
 */
export function useAutosave<T>(
  value: T,
  save: (value: T) => Promise<void>,
  { enabled, delay = 800 }: AutosaveOptions
) {
  const [saved, setSaved] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState(0);

  const saveRef = useRef(save);
  const latestRef = useRef(value);
  const savedRef = useRef(value);
  const enabledRef = useRef(enabled);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    saveRef.current = save;
    latestRef.current = value;
    enabledRef.current = enabled;
  });

  const run = useCallback((snapshot: T) => {
    queueRef.current = queueRef.current.then(async () => {
      // A newer edit has its own save queued; an unchanged value needs none.
      if (snapshot !== latestRef.current || snapshot === savedRef.current) return;
      setSaving(true);
      try {
        await saveRef.current(snapshot);
        savedRef.current = snapshot;
        setSaved(snapshot);
        setSavedAt(new Date());
        setError(null);
      } catch (err) {
        setError((err as Error).message || "Couldn't save");
      } finally {
        setSaving(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!enabled || value === savedRef.current) return;
    const timer = setTimeout(() => run(value), delay);
    return () => clearTimeout(timer);
  }, [value, enabled, delay, run, attempt]);

  useEffect(() => {
    const latest = latestRef;
    const lastSaved = savedRef;
    const isEnabled = enabledRef;
    return () => {
      if (isEnabled.current && latest.current !== lastSaved.current) run(latest.current);
    };
  }, [run]);

  const unsaved = enabled && value !== saved;
  useEffect(() => {
    if (!unsaved) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  let status: AutosaveStatus = savedAt ? "saved" : "idle";
  if (error) status = "error";
  else if (saving) status = "saving";
  else if (unsaved) status = "pending";

  const retry = useCallback(() => {
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { status, error, savedAt, retry };
}
