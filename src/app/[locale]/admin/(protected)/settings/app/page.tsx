"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { adminGlass } from "@/lib/admin-glass";
import { ANDROID_APK_DOWNLOAD_PATH, ANDROID_APK_PATHNAME } from "@/lib/android-apk";
import {
  SettingsNotice,
  SettingsPageHeader,
  SettingsSection,
} from "../_components/settings-ui";

export default function AppReleaseSettingsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.error("Choose an APK file");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".apk")) {
      toast.error("File must be an .apk");
      return;
    }

    setPending(true);
    setProgress(0);
    try {
      await upload(ANDROID_APK_PATHNAME, file, {
        access: "public",
        handleUploadUrl: "/api/admin/apk/upload",
        contentType: file.type || "application/vnd.android.package-archive",
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      toast.success("Android app published");
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <>
      <SettingsPageHeader
        title="Android app"
        description="Upload the APK to Vercel Blob. Site download buttons send people to the current file."
      />

      <SettingsSection title="Package" description="Replaces the previous public APK at the same path.">
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            className={`${adminGlass.input} py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-medium file:text-black`}
          />
          {progress != null ? (
            <p className="text-xs tabular-nums text-zinc-400">{progress}% uploaded</p>
          ) : null}
          <button type="submit" disabled={pending} className={adminGlass.buttonPrimary}>
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Publish APK
          </button>
        </form>
      </SettingsSection>

      <SettingsNotice title="Download">
        Public link:{" "}
        <a className="text-white underline underline-offset-2" href={ANDROID_APK_DOWNLOAD_PATH}>
          {ANDROID_APK_DOWNLOAD_PATH}
        </a>
        . The file itself is served from Blob. Upload completion webhooks do not run on localhost;
        the file is still stored and the download route reads it.
      </SettingsNotice>
    </>
  );
}