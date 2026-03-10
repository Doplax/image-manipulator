import Header from "@/components/Header";
import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AppShell />
      </main>

      <footer className="mt-16 border-t border-divider py-6 text-center text-xs text-default-400">
        Image Manipulator · Next.js 16 · Sharp · @imgly/background-removal
      </footer>
    </>
  );
}
