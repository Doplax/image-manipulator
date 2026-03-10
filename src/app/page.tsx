import Header from "@/components/Header";
import DropZone from "@/components/DropZone";
import ImageGallery from "@/components/ImageGallery";
import ControlPanel from "@/components/ControlPanel";
import PreviewPanel from "@/components/PreviewPanel";
import ProcessButton from "@/components/ProcessButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Manipula tus imágenes
            <span className="ml-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              sin esfuerzo
            </span>
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Arrastra una o varias imágenes · Redimensiona · Elimina el fondo con IA · Convierte a PNG, JPG, WebP, AVIF, TIFF
          </p>
        </div>

        {/* Drop Zone */}
        <DropZone />

        {/* Gallery */}
        <ImageGallery />

        {/* Editor grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Preview + Action */}
          <div className="space-y-4">
            <PreviewPanel />
            <ProcessButton />
          </div>

          {/* Right: Controls */}
          <div>
            <ControlPanel />
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        Image Manipulator · Next.js 16 · Sharp · @imgly/background-removal
      </footer>
    </>
  );
}
