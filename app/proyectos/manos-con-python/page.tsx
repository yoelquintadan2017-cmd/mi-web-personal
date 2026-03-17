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

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">
            Proyecto destacado
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Proyecto Manos con Python
          </h1>

          <p className="text-lg md:text-xl text-white/90 leading-8 max-w-2xl mx-auto">
            Un proyecto interactivo y visual enfocado en Python, visión por
            computadora y efectos tecnológicos para crear una experiencia más
            moderna e inmersiva.
          </p>
        </div>
      </section>
    </main>
  );
}