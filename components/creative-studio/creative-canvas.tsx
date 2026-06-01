"use client";

import { useEffect, useRef, useState } from "react";
import { Scene, SCENES } from "./index";

interface CreativeCanvasProps {
  scene: Scene;
  onFinish: (canvasData: string) => void;
}

type Tool = "brush" | "pencil" | "marker" | "eraser";
type Sticker = "star" | "heart" | "tree" | "flower" | "cloud" | "sparkle";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#ABEBC6",
  "#F5B7B1", "#D7BDE2", "#A9CCE3", "#A3E4D7", "#FAD7A0",
];

const STICKERS: { type: Sticker; emoji: string }[] = [
  { type: "star", emoji: "⭐" },
  { type: "heart", emoji: "💖" },
  { type: "tree", emoji: "🌳" },
  { type: "flower", emoji: "🌸" },
  { type: "cloud", emoji: "☁️" },
  { type: "sparkle", emoji: "✨" },
];

export function CreativeCanvas({ scene, onFinish }: CreativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#FF6B6B");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawSketchbookBackground(ctx, canvas.width, canvas.height);
        drawBaseScene(ctx, scene.id, canvas.width, canvas.height);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    saveToHistory();

    return () => window.removeEventListener("resize", updateSize);
  }, [scene]);

  const drawSketchbookBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Cream sketchbook page
    ctx.fillStyle = "#FDFCF8";
    ctx.fillRect(0, 0, width, height);

    // Subtle dotted grid (only on background, NOT on strokes)
    ctx.fillStyle = "rgba(180, 180, 180, 0.15)"; // Light grey, very subtle
    const gridSize = 25; // Spacing between dots
    const dotRadius = 1; // Small dot size
    
    for (let x = gridSize; x < width; x += gridSize) {
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawBaseScene = (ctx: CanvasRenderingContext2D, sceneId: string, width: number, height: number) => {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const centerX = width / 2;
    const centerY = height / 2;

    switch (sceneId) {
      case "dream-planet":
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(width, height) / 4, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "treehouse":
        ctx.fillStyle = "rgba(139, 115, 85, 0.1)";
        ctx.fillRect(centerX - 15, centerY + 20, 30, height / 2 - 20);
        ctx.strokeRect(centerX - 50, centerY - 40, 100, 60);
        break;
      case "magical-garden":
        ctx.beginPath();
        ctx.moveTo(0, height * 0.65);
        ctx.lineTo(width, height * 0.65);
        ctx.stroke();
        break;
      default:
        ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    }
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    if (point) {
      lastPointRef.current = point;
      drawPoint(point.x, point.y);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPointRef.current = null;
      saveToHistory();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    if (!point || !lastPointRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Smooth, solid strokes (NOT dotted)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 3;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      
      // Opacity for different tools
      if (tool === "marker") {
        ctx.globalAlpha = 0.5;
      } else if (tool === "pencil") {
        ctx.globalAlpha = 0.85;
      } else {
        ctx.globalAlpha = 1; // Brush is fully solid
      }
    }

    // Draw smooth continuous line (NOT dotted)
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    
    // Use quadratic curve for smooth, natural strokes
    const midX = (lastPointRef.current.x + point.x) / 2;
    const midY = (lastPointRef.current.y + point.y) / 2;
    ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
    
    ctx.stroke();
    ctx.globalAlpha = 1;

    lastPointRef.current = point;
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Solid point (NOT dotted)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = color;
      
      // Opacity for different tools
      if (tool === "marker") {
        ctx.globalAlpha = 0.5;
      } else if (tool === "pencil") {
        ctx.globalAlpha = 0.85;
      } else {
        ctx.globalAlpha = 1; // Brush is fully solid
      }
    }

    // Draw solid circle (NOT dotted)
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      loadFromHistory(historyStep - 1);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      loadFromHistory(historyStep + 1);
    }
  };

  const loadFromHistory = (step: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSketchbookBackground(ctx, canvas.width, canvas.height);
    drawBaseScene(ctx, scene.id, canvas.width, canvas.height);
    saveToHistory();
  };

  const addSticker = (sticker: Sticker, emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "48px Arial";
    ctx.fillText(emoji, canvas.width / 2 - 24, canvas.height / 2);
    saveToHistory();
    setShowStickers(false);
  };

  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    onFinish(dataUrl);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={() => setShowScenes(!showScenes)}
          className="rounded-lg bg-white px-3 py-2 text-[13px] font-medium shadow-sm"
          style={{ color: "#083F56" }}
        >
          {scene.emoji} {scene.title}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={handleUndo} disabled={historyStep <= 0} className="rounded-lg bg-white p-2 shadow-sm disabled:opacity-30">↶</button>
          <button onClick={handleRedo} disabled={historyStep >= history.length - 1} className="rounded-lg bg-white p-2 shadow-sm disabled:opacity-30">↷</button>
          <button onClick={handleFinish} className="rounded-full px-6 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: "#76648B" }}>Finish</button>
        </div>
      </div>

      {/* Canvas - Full notebook page, no borders */}
      <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: "#FDFCF8" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="h-full w-full touch-none"
          style={{ 
            touchAction: "none",
            cursor: "crosshair",
          }}
        />
      </div>

      {/* Bottom Toolbar */}
      <div className="border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-center gap-2">
          {(["brush", "pencil", "marker", "eraser"] as Tool[]).map((t) => (
            <button key={t} onClick={() => setTool(t)} className="rounded-lg px-4 py-2 text-[13px] font-medium capitalize" style={{ backgroundColor: tool === t ? "#76648B" : "#F0F0F0", color: tool === t ? "#FFFFFF" : "#083F56" }}>{t}</button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-center gap-2 overflow-x-auto">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} className="h-8 w-8 flex-shrink-0 rounded-full" style={{ backgroundColor: c, border: color === c ? "3px solid #083F56" : "2px solid #E0E0E0" }} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px]" style={{ color: "#083F56" }}>Size:</span>
            <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowStickers(!showStickers)} className="rounded-lg bg-white px-3 py-2 text-[13px] font-medium shadow-sm" style={{ color: "#083F56" }}>✨ Stickers</button>
            <button onClick={handleClear} className="rounded-lg bg-white px-3 py-2 text-[13px] font-medium shadow-sm" style={{ color: "#FF6B6B" }}>Clear</button>
          </div>
        </div>
      </div>

      {/* Stickers Panel */}
      {showStickers && (
        <div className="absolute bottom-[180px] left-0 right-0 mx-4 rounded-2xl bg-white p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14px] font-semibold" style={{ color: "#083F56" }}>Add Stickers</p>
            <button onClick={() => setShowStickers(false)} className="text-[20px]" style={{ color: "#083F56" }}>×</button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {STICKERS.map((s) => (
              <button key={s.type} onClick={() => addSticker(s.type, s.emoji)} className="rounded-lg bg-gray-50 p-3 text-[32px]">{s.emoji}</button>
            ))}
          </div>
        </div>
      )}

      {/* Scene Switcher */}
      {showScenes && (
        <div className="absolute left-0 right-0 top-[60px] mx-4 max-h-[400px] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[14px] font-semibold" style={{ color: "#083F56" }}>Switch Scene</p>
            <button onClick={() => setShowScenes(false)} className="text-[20px]" style={{ color: "#083F56" }}>×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SCENES.map((s) => (
              <button key={s.id} onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-left">
                <span className="text-[24px]">{s.emoji}</span>
                <span className="text-[12px] font-medium" style={{ color: "#083F56" }}>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
