"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) {
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  ctx.fillStyle = "#67e8f9";

  for (const [start, end] of HAND_CONNECTIONS) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!a || !b) continue;

    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.stroke();
  }

  for (const point of landmarks) {
    ctx.beginPath();
    ctx.arc(point.x * width, point.y * height, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CameraDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const isCameraOnRef = useRef(false);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

const handLandmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "/models/hand_landmarker.task",
  },
  runningMode: "VIDEO",
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

        if (!active) return;

        handLandmarkerRef.current = handLandmarker;
        setIsModelReady(true);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detector de manos.");
      }
    };

    loadModel();

    return () => {
      active = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const renderLoop = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const handLandmarker = handLandmarkerRef.current;

  if (!video || !canvas || !handLandmarker || !isCameraOnRef.current) {
    return;
  }

  if (video.readyState < 2) {
    rafRef.current = requestAnimationFrame(renderLoop);
    return;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (width === 0 || height === 0) {
    rafRef.current = requestAnimationFrame(renderLoop);
    return;
  }

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  const nowMs = performance.now();
  const result = handLandmarker.detectForVideo(video, nowMs);

  for (const landmarks of result.landmarks) {
    drawLandmarks(ctx, landmarks, width, height);
  }

  rafRef.current = requestAnimationFrame(renderLoop);
};

  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

    isCameraOnRef.current = true;
setIsCameraOn(true);

if (rafRef.current) {
  cancelAnimationFrame(rafRef.current);
}
rafRef.current = requestAnimationFrame(renderLoop);

    } catch (err) {
      console.error(err);
      setError("No se pudo acceder a la cámara. Revisa los permisos.");
    }
  };

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    isCameraOnRef.current = false;
    setIsCameraOn(false);
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
      <div className="bg-black/50 border border-cyan-400/20 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Demo interactiva con reconocimiento de manos
        </h2>

        <p className="text-white/80 mb-6 leading-7">
          Enciende la cámara para detectar las manos y dibujar sus puntos en tiempo real.
        </p>

        <div className="flex gap-4 flex-wrap mb-6">
          {!isCameraOn ? (
            <button
              onClick={startCamera}
              disabled={!isModelReady}
              className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isModelReady ? "Encender cámara" : "Cargando detector..."}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:scale-105 transition"
            >
              Apagar cámara
            </button>
          )}
        </div>

        {error && <p className="text-red-300 mb-4">{error}</p>}

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[260px] md:h-[520px] object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}