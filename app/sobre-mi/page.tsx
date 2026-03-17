export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <img
          src="/foto-perfil.png"
          alt="Foto de perfil"
          className="w-48 h-48 object-cover rounded-full mb-8"
        />

        <h1 className="text-4xl font-bold mb-6">Sobre mí</h1>

        <p className="text-lg text-white/80 leading-8 max-w-2xl">
          Esta página será para presentarte. Aquí podrás contar quién eres, qué
          haces, tus intereses, tus habilidades y tus metas.
        </p>
      </div>
    </main>
  );
}