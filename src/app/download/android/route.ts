import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { ANDROID_APK_PATHNAME } from "@/lib/android-apk";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "App download is not configured" },
      { status: 503 },
    );
  }

  const { blobs } = await list({
    prefix: ANDROID_APK_PATHNAME,
    limit: 5,
  });

  const apk = blobs.find((blob) => blob.pathname === ANDROID_APK_PATHNAME) ?? blobs[0];
  if (!apk) {
    return NextResponse.json({ error: "Android app is not published yet" }, { status: 404 });
  }

  const target = apk.downloadUrl || apk.url;
  return NextResponse.redirect(target, 302);
}
