/** Stable public pathname in the Vercel Blob store. Overwritten on each admin upload. */
export const ANDROID_APK_PATHNAME = "apps/lenix-wallet.apk";

export const ANDROID_APK_DOWNLOAD_PATH = "/download/android";

export const ANDROID_APK_MAX_BYTES = 200 * 1024 * 1024;

export const ANDROID_APK_CONTENT_TYPES = [
  "application/vnd.android.package-archive",
  "application/octet-stream",
  "application/zip",
] as const;
