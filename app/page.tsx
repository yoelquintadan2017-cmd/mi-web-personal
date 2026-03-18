import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/fondo.png')" }}
    >
      <div className="min-h-screen bg-black/65">
        <header className="w-full border-b border-white/10">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">Mi Web Personal</h1>

            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-cyan-300 transition">
                Inicio
              </Link>
              <Link href="/sobre-mi" className="hover:text-cyan-300 transition">
                Sobre mí
              </Link>
              <Link href="/proyectos" className="hover:text-cyan-300 transition">
                Proyectos
              </Link>
              <Link href="/contacto" className="hover:text-cyan-300 transition">
                Contacto
              </Link>
            </div>
          </nav>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-20 min-h-[85vh] flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">
                Sitio personal
              </p>

              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Hola, soy Yoel Adan
              </h2>

              <p className="text-lg text-white/90 leading-8 max-w-xl mb-8">
                Bienvenido a mi espacio personal. Aquí compartiré mis proyectos,
                fotos, videos, ideas, publicaciones y parte de mi crecimiento
                profesional y creativo.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/proyectos"
                  className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition"
                >
                  Ver proyectos
                </Link>

                <Link
                  href="/sobre-mi"
                  className="px-6 py-3 rounded-2xl border border-white font-semibold hover:bg-white hover:text-black transition"
                >
                  Conóceme
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src="/foto-perfil.png"
                alt="Foto de perfil"
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-3xl border border-white/20 shadow-2xl"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}