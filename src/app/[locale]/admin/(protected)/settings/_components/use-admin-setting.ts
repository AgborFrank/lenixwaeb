"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminSetting<T>(configKey: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/settings?key=${encodeURIComponent(configKey)}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData({ ...initial, ...(result.data as T) });
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
    // `initial` is a module-level default object from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (value: T) => {
      setIsSaving(true);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: configKey, value }),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Saved");
          setData(value);
          return true;
        }
        toast.error(result.error || "Failed to save");
        return false;
      } catch {
        toast.error("Failed to save");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [configKey],
  );

  return { data, setData, isLoading, isSaving, save, reload: load };
}
