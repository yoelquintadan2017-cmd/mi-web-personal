import CameraDemo from "./CameraDemo";

export default function ManosConPythonPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/manos-python.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/65" />

        <div className="w-full py-20">
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">
              Proyecto destacado
            </p>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Proyecto Manos con Python
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-8 max-w-3xl mx-auto">
              Un proyecto interactivo centrado en visión por computadora,
              seguimiento visual y experiencias tecnológicas en tiempo real.
            </p>
          </div>

          <CameraDemo />
        </div>
      </section>
    </main>
  );
}