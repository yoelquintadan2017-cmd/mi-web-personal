import Link from "next/link";

export default function ProyectosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Mis proyectos</h1>
        <p className="text-lg text-white/80 leading-8 mb-10">
          Aquí mostraré mis proyectos personales, prácticas, ideas y trabajos
          que he desarrollado.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/proyectos/manos-con-python"
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition"
          >
            <img
              src="/proyectos/manos-python/portada.jpg"
              alt="Proyecto manos con Python"
              className="w-full h-60 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3">
                Proyecto Manos con Python
              </h2>

              <p className="text-white/75 leading-7">
                Proyecto de visión por computadora en Python para detectar
                movimientos de la mano y desarrollar funciones interactivas.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}