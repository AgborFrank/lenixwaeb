import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  ANDROID_APK_CONTENT_TYPES,
  ANDROID_APK_MAX_BYTES,
  ANDROID_APK_PATHNAME,
} from "@/lib/android-apk";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireAdmin();

        if (pathname !== ANDROID_APK_PATHNAME) {
          throw new Error("Upload path must be the Android app package");
        }

        return {
          allowedContentTypes: [...ANDROID_APK_CONTENT_TYPES],
          maximumSizeInBytes: ANDROID_APK_MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async () => {
        // The public pathname is stable, so the download route reads the latest blob.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload rejected";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
