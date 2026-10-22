import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-black px-4 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-neutral-400">The page you requested is not available.</p>
      </div>
    </main>
  );
}
