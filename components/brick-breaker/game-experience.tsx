"use client";

import { useEffect, useRef, useState } from "react";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  visible: boolean;
  alpha: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GameExperienceProps {
  onComplete: (bricksCleared: number, timeSpent: number) => void;
}

export function GameExperience({ onComplete }: GameExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bricksCleared, setBricksCleared] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();
  const gameStateRef = useRef<{
    ball: Ball;
    paddle: Paddle;
    bricks: Brick[];
    mouseX: number;
    touchX: number;
  }>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Honeydew wellness colors - soft and calming
    const brickColors = [
      "#E6D5F5", // Soft Lavender
      "#B8CBBE", // Sage Mist
      "#FFD4B8", // Muted Peach
      "#FFF4B8", // Pale Yellow
      "#C8F0E6", // Soft Mint
      "#F5D5E6", // Soft Pink
    ];

    // Initialize game objects
    const paddleWidth = 120;
    const paddleHeight = 16;
    const paddle: Paddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: canvas.height - 60,
      width: paddleWidth,
      height: paddleHeight,
    };

    const ball: Ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 2.5, // Slow, calming speed
      dy: -2.5,
      radius: 8,
    };

    // Create bricks
    const brickRowCount = 6;
    const brickColumnCount = 7;
    const brickWidth = 70;
    const brickHeight = 28;
    const brickPadding = 12;
    const brickOffsetTop = 80;
    const brickOffsetLeft =
      (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2;

    const bricks: Brick[] = [];
    for (let row = 0; row < brickRowCount; row++) {
      for (let col = 0; col < brickColumnCount; col++) {
        bricks.push({
          x: brickOffsetLeft + col * (brickWidth + brickPadding),
          y: brickOffsetTop + row * (brickHeight + brickPadding),
          width: brickWidth,
          height: brickHeight,
          color: brickColors[row % brickColors.length],
          visible: true,
          alpha: 1,
        });
      }
    }

    gameStateRef.current = {
      ball,
      paddle,
      bricks,
      mouseX: canvas.width / 2,
      touchX: canvas.width / 2,
    };

    // Mouse/Touch controls
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (gameStateRef.current) {
        gameStateRef.current.mouseX = e.clientX - rect.left;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      if (gameStateRef.current && e.touches[0]) {
        gameStateRef.current.touchX = e.touches[0].clientX - rect.left;
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Collision detection
    const checkBrickCollision = (ball: Ball, brick: Brick): boolean => {
      if (!brick.visible) return false;

      const ballLeft = ball.x - ball.radius;
      const ballRight = ball.x + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballBottom = ball.y + ball.radius;

      const brickLeft = brick.x;
      const brickRight = brick.x + brick.width;
      const brickTop = brick.y;
      const brickBottom = brick.y + brick.height;

      return (
        ballRight > brickLeft &&
        ballLeft < brickRight &&
        ballBottom > brickTop &&
        ballTop < brickBottom
      );
    };

    // Draw functions
    const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
      // Soft glowing ball
      const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
      gradient.addColorStop(0, "rgba(87, 169, 154, 0.9)"); // Calm Teal
      gradient.addColorStop(1, "rgba(87, 169, 154, 0.4)");

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
      ctx.fillStyle = "#57A99A"; // Calm Teal
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
      ctx.fill();
      ctx.closePath();
    };

    const drawBrick = (ctx: CanvasRenderingContext2D, brick: Brick) => {
      if (!brick.visible) return;

      ctx.globalAlpha = brick.alpha;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 8);
      ctx.fill();
      ctx.closePath();

      // Subtle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1;
    };

    const drawParticles = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      // Gentle particles when brick breaks
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 15;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
    };

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx || !gameStateRef.current) return;

      const { ball, paddle, bricks, mouseX, touchX } = gameStateRef.current;

      // Clear canvas with Honeydew background
      ctx.fillStyle = "#F0FFF0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update paddle position (smooth follow)
      const targetX = mouseX || touchX;
      paddle.x += (targetX - paddle.width / 2 - paddle.x) * 0.15;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Paddle collision
      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -Math.abs(ball.dy);
        // Add slight horizontal variation based on where ball hits paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 4;
      }

      // Bottom boundary - reset ball gently (no game over)
      if (ball.y + ball.radius > canvas.height) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 2.5 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -2.5;
      }

      // Brick collision
      let clearedThisFrame = 0;
      bricks.forEach((brick) => {
        if (checkBrickCollision(ball, brick)) {
          ball.dy = -ball.dy;
          brick.visible = false;
          clearedThisFrame++;

          // Draw particles at brick position
          drawParticles(
            ctx,
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
            brick.color
          );
        }

        // Fade out animation for broken bricks
        if (!brick.visible && brick.alpha > 0) {
          brick.alpha -= 0.05;
        }
      });

      if (clearedThisFrame > 0) {
        setBricksCleared((prev) => prev + clearedThisFrame);
      }

      // Draw everything
      bricks.forEach((brick) => drawBrick(ctx, brick));
      drawPaddle(ctx, paddle);
      drawBall(ctx, ball);

      // Check if all bricks cleared
      const allCleared = bricks.every((brick) => !brick.visible);
      if (allCleared) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeout(() => {
          onComplete(bricks.length, timeSpent);
        }, 500);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div className="relative h-full w-full bg-[#F0FFF0]">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ touchAction: "none" }}
      />

      {/* Bricks cleared counter - subtle */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2">
        <div className="rounded-full bg-white/40 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm font-medium text-[#57A99A]">
            {bricksCleared} cleared
          </p>
        </div>
      </div>
    </div>
  );
}
