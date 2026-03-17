export default function ManosConPythonPage() {
  const codigoEjemplo = `
import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(img, handLms, mp_hands.HAND_CONNECTIONS)

    cv2.imshow("Proyecto Manos", img)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
`.trim();

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Proyecto Manos con Python</h1>

        <p className="text-lg text-white/80 leading-8 mb-10 max-w-4xl">
          Este proyecto fue desarrollado con Python para trabajar con detección
          de manos mediante visión por computadora. La idea fue reconocer
          movimientos y usarlos en funciones interactivas dentro del sistema.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <img
            src="/proyectos/manos-python/foto1.jpg"
            alt="Captura del proyecto manos 1"
            className="w-full h-80 object-cover rounded-3xl border border-white/10"
          />
          <img
            src="/proyectos/manos-python/foto2.jpg"
            alt="Captura del proyecto manos 2"
            className="w-full h-80 object-cover rounded-3xl border border-white/10"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Tecnologías utilizadas</h2>
          <ul className="text-white/80 leading-8">
            <li>Python</li>
            <li>OpenCV</li>
            <li>MediaPipe</li>
            <li>Visual Studio Code</li>
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Descripción del proyecto</h2>
          <p className="text-white/80 leading-8">
            En este proyecto trabajé con seguimiento de puntos de la mano,
            detección de gestos y control visual. Fue una práctica importante
            para aprender sobre visión artificial, reconocimiento en tiempo real
            y automatización con Python.
          </p>
        </div>

        <div className="bg-black border border-white/10 rounded-3xl p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Fragmento de código</h2>
          <pre className="text-sm text-green-300 whitespace-pre-wrap">
            <code>{codigoEjemplo}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="/proyectos/manos-python/manos.py"
            target="_blank"
            className="px-6 py-3 rounded-2xl bg-white text-black font-semibold"
          >
            Ver código completo
          </a>

          <a
            href="/proyectos"
            className="px-6 py-3 rounded-2xl border border-white font-semibold"
          >
            Volver a proyectos
          </a>
        </div>
      </div>
    </main>
  );
}