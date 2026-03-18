import CameraDemo from "./CameraDemo";

export default function ManosConPythonPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">
          Proyecto destacado
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Proyecto Manos con Python
        </h1>

        <p className="text-lg text-white/85 leading-8 max-w-3xl mb-10">
          Este proyecto combina Python, visión por computadora y efectos
          visuales para detectar manos en tiempo real y crear una experiencia
          interactiva y tecnológica.
        </p>

        <div className="flex gap-4 flex-wrap mb-14">
          <a
            href="#demo"
            className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition"
          >
            Probar demo en tu dispositivo
          </a>

          <a
            href="https://github.com/yoelquintadan2017-cmd/mi-web-personal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl border border-white font-semibold hover:bg-white hover:text-black transition"
          >
            Ver código completo
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <img
              src="/proyectos/manos-python/portada.jpg"
              alt="Portada del proyecto manos con Python"
              className="w-full h-72 object-cover"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <img
              src="/proyectos/manos-python/foto1.jpg"
              alt="Vista 1 del proyecto manos con Python"
              className="w-full h-72 object-cover"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <img
              src="/proyectos/manos-python/foto2.jpg"
              alt="Vista 2 del proyecto manos con Python"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
            <p className="text-white/80 leading-8">
              El objetivo de este proyecto fue detectar y seguir las manos con
              la cámara para luego aplicar lógica interactiva y efectos visuales.
              Esta versión web permite que otras personas prueben una demo desde
              su propio dispositivo, sin instalar Python.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">Tecnologías usadas</h2>
            <ul className="text-white/80 leading-8">
              <li>Python</li>
              <li>OpenCV</li>
              <li>Seguimiento de manos</li>
              <li>Next.js</li>
              <li>MediaPipe en navegador</li>
              <li>Vercel</li>
            </ul>
          </div>
        </div>

        <div className="bg-black border border-cyan-400/20 rounded-3xl p-6 md:p-8 mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Fragmento del código Python
          </h2>

          <pre className="text-sm md:text-base text-cyan-300 whitespace-pre-wrap">
{`import cv2
import mediapipe as mp

cap = cv2.VideoCapture(0)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

while True:
    success, frame = cap.read()
    if not success:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, handLms, mp_hands.HAND_CONNECTIONS)

    cv2.imshow("Proyecto Manos con Python", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()`}
          </pre>
        </div>
      </section>

      <section id="demo" className="pb-20">
        <CameraDemo />
      </section>
    </main>
  );
}