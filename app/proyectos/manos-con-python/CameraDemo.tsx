"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  FaceLandmarker,
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

function mirrorX(x: number, width: number) {
  return width - x * width;
}

function drawNeonText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#ffe600",
  size = 18
) {
  ctx.save();
  ctx.font = `bold ${size}px Arial`;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.strokeStyle = "#d9d9d9";
  ctx.lineWidth = 3;
  ctx.fillStyle = "#ffffff";

  for (const [start, end] of HAND_CONNECTIONS) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!a || !b) continue;

    ctx.beginPath();
    ctx.moveTo(mirrorX(a.x, width), a.y * height);
    ctx.lineTo(mirrorX(b.x, width), b.y * height);
    ctx.stroke();
  }

  for (const point of landmarks) {
    ctx.beginPath();
    ctx.arc(mirrorX(point.x, width), point.y * height, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFacePoints(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.fillStyle = "#00f5ff";

  for (let i = 0; i < landmarks.length; i += 2) {
    const p = landmarks[i];
    ctx.beginPath();
    ctx.arc(mirrorX(p.x, width), p.y * height, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFaceBox(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) {
  const xs = landmarks.map((p) => mirrorX(p.x, width));
  const ys = landmarks.map((p) => p.y * height);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  ctx.save();
  ctx.strokeStyle = "#ffe600";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#ffe600";
  ctx.shadowBlur = 10;
  ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);
  ctx.restore();

  return { minX, minY, maxX, maxY };
}

function getBlendshapeScore(
  shapes: Array<{ categoryName?: string; score?: number }>,
  name: string
) {
  return shapes.find((s) => s.categoryName === name)?.score ?? 0;
}

function inferMood(
  shapes: Array<{ categoryName?: string; score?: number }>
): { label: string; confidence: number } {
  const smile =
    (getBlendshapeScore(shapes, "mouthSmileLeft") +
      getBlendshapeScore(shapes, "mouthSmileRight")) / 2;

  const frown =
    (getBlendshapeScore(shapes, "mouthFrownLeft") +
      getBlendshapeScore(shapes, "mouthFrownRight")) / 2;

  const jawOpen = getBlendshapeScore(shapes, "jawOpen");
  const browUp = getBlendshapeScore(shapes, "browInnerUp");

  if (smile > 0.45) {
    return { label: "ALEGRE", confidence: smile };
  }

  if (jawOpen > 0.45 || browUp > 0.45) {
    return { label: "SORPRESA", confidence: Math.max(jawOpen, browUp) };
  }

  if (frown > 0.35) {
    return { label: "SERIO", confidence: frown };
  }

  return {
    label: "NEUTRO",
    confidence: Math.max(0.45, 1 - Math.max(smile, frown, jawOpen, browUp)),
  };
}

function classifyHandState(
  landmarks: NormalizedLandmark[],
  handedness: string
): string {
  const fingersOpen =
    (landmarks[8].y < landmarks[6].y ? 1 : 0) +
    (landmarks[12].y < landmarks[10].y ? 1 : 0) +
    (landmarks[16].y < landmarks[14].y ? 1 : 0) +
    (landmarks[20].y < landmarks[18].y ? 1 : 0);

  const thumbOpen =
    handedness === "Right"
      ? landmarks[4].x < landmarks[3].x
      : landmarks[4].x > landmarks[3].x;

  const totalOpen = fingersOpen + (thumbOpen ? 1 : 0);

  if (totalOpen >= 4) return "ABIERTA";
  if (totalOpen <= 1) return "CERRADA";
  return "PARCIAL";
}

export default function CameraDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const rafRef = useRef<number | null>(null);
  const isCameraOnRef = useRef(false);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadModels = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const [handLandmarker, faceLandmarker] = await Promise.all([
          HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/models/hand_landmarker.task",
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }),

          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/models/face_landmarker.task",
            },
            runningMode: "VIDEO",
            numFaces: 1,
            outputFaceBlendshapes: true,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }),
        ]);

        if (!active) return;

        handLandmarkerRef.current = handLandmarker;
        faceLandmarkerRef.current = faceLandmarker;
        setIsReady(true);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los detectores.");
      }
    };

    loadModels();

    return () => {
      active = false;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const renderLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const handLandmarker = handLandmarkerRef.current;
    const faceLandmarker = faceLandmarkerRef.current;

    if (
      !video ||
      !canvas ||
      !handLandmarker ||
      !faceLandmarker ||
      !isCameraOnRef.current
    ) {
      return;
    }

    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const nowMs = performance.now();

    const handResult = handLandmarker.detectForVideo(video, nowMs);
    const faceResult = faceLandmarker.detectForVideo(video, nowMs);

    for (let i = 0; i < handResult.landmarks.length; i++) {
      const landmarks = handResult.landmarks[i];
      const handInfo = handResult.handedness[i]?.[0];
      const handedness = handInfo?.categoryName ?? "Desconocida";
      const state = classifyHandState(landmarks, handedness);

      drawHand(ctx, landmarks, width, height);

      const anchor = landmarks[0];
      const textX = mirrorX(anchor.x, width) - 20;
      const textY = anchor.y * height - 30;

      drawNeonText(
        ctx,
        `MANO ${i + 1}: ${state} (${handedness.toUpperCase()})`,
        textX,
        textY,
        "#7CFF00",
        16
      );

      const tip = landmarks[8];
      ctx.save();
      ctx.fillStyle = "#19ff19";
      ctx.shadowColor = "#19ff19";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(mirrorX(tip.x, width), tip.y * height, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (faceResult.faceLandmarks.length > 0) {
      const face = faceResult.faceLandmarks[0];
      const box = drawFaceBox(ctx, face, width, height);
      drawFacePoints(ctx, face, width, height);

      const shapes =
        faceResult.faceBlendshapes?.[0]?.categories?.map((c) => ({
          categoryName: c.categoryName,
          score: c.score,
        })) ?? [];

      const mood = inferMood(shapes);
      const percent = Math.round(mood.confidence * 100);

      drawNeonText(
        ctx,
        `ESTADO: ${mood.label}   ${percent}%`,
        box.minX,
        box.minY - 18,
        "#ffe600",
        18
      );
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

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
          Demo interactiva: manos + rostro
        </h2>

        <p className="text-white/80 mb-6 leading-7">
          Enciende la cámara para ver landmarks de manos, rostro y un estado facial aproximado.
        </p>

        <div className="flex gap-4 flex-wrap mb-6">
          {!isCameraOn ? (
            <button
              onClick={startCamera}
              disabled={!isReady}
              className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReady ? "Encender cámara" : "Cargando detectores..."}
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
            className="w-full h-[260px] md:h-[520px] object-cover scale-x-[-1]"
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