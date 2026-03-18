import Link from "next/link";

export default function ProyectosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Mis proyectos</h1>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 min-h-[500px] flex items-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/manos-python.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 p-10 md:p-14 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">
              Proyecto destacado
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Proyecto Manos con Python
            </h2>

            <p className="text-lg text-white/90 leading-8 mb-8">
              Un proyecto visual e interactivo donde exploro Python, visión por
              computadora y efectos tecnológicos para crear experiencias más
              llamativas y dinámicas.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/proyectos/manos-con-python"
                className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition"
              >
                Ver detalles
              </Link>

              <a
                href="https://github.com/yoelquintadan2017-cmd/mi-web-personal"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl border border-white font-semibold hover:bg-white hover:text-black transition"
              >
                Ver código
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}