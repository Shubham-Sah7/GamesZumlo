"use client";

import { useEffect, useRef, useState } from "react";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shadowColor: string;
  visible: boolean;
  alpha: number;
  scale: number;
  breaking: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
}

interface GameExperienceProps {
  onComplete: (bricksCleared: number, timeSpent: number) => void;
  onFailed: (bricksCleared: number, timeSpent: number) => void;
}

export function GameExperience({ onComplete, onFailed }: GameExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bricksCleared, setBricksCleared] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>(0);
  const gameStateRef = useRef<{
    ball: Ball;
    paddle: Paddle;
    bricks: Brick[];
    particles: Particle[];
    mouseX: number;
    touchX: number;
  } | null>(null);

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

    // Honeydew wellness colors matching reference image
    const COLORS = {
      lavender: "#8B7B9E",      // Purple/Lavender
      teal: "#5DBAA4",          // Teal/Mint
      orange: "#FFA366",        // Soft Orange
      deepTeal: "#2D5F5D",      // Deep Teal
      background: "#D4E8E0",    // Soft mint background
      paddle: "#2D5F5D",        // Deep teal paddle
      ball: "#FFA366",          // Orange ball
    };

    // Safe area offsets
    const safeAreaTop = 80; // Space for counter below notch
    const safeAreaBottom = 100; // Space above bottom gesture area
    
    // Initialize paddle - positioned in middle-lower area (matching reference)
    const paddleWidth = 160;
    const paddleHeight = 16;
    const paddle: Paddle = {
      x: canvas.width / 2 - paddleWidth / 2,
      y: canvas.height - safeAreaBottom - 120, // Middle-lower area, not at bottom
      width: paddleWidth,
      height: paddleHeight,
      targetX: canvas.width / 2 - paddleWidth / 2,
    };

    // Initialize ball - starts in gameplay area
    const ball: Ball = {
      x: canvas.width / 2,
      y: paddle.y - 100,
      dx: 3.5,
      dy: -3.5,
      radius: 12,
      trail: [],
    };

    // Create structured brick formation (pyramid/diamond pattern)
    const brickWidth = 50;
    const brickHeight = 24;
    const brickPadding = 6;
    const brickOffsetTop = safeAreaTop + 20; // Below counter
    
    const bricks: Brick[] = [];
    
    // Diamond/pyramid pattern inspired by reference
    const pattern = [
      [0, 0, 0, 1, 1, 1, 0, 0, 0],      // Row 1: 3 bricks
      [0, 0, 1, 1, 1, 1, 1, 0, 0],      // Row 2: 5 bricks
      [0, 1, 1, 1, 1, 1, 1, 1, 0],      // Row 3: 7 bricks
      [1, 1, 1, 1, 1, 1, 1, 1, 1],      // Row 4: 9 bricks
      [1, 1, 1, 1, 1, 1, 1, 1, 1],      // Row 5: 9 bricks
      [1, 1, 1, 1, 1, 1, 1, 1, 1],      // Row 6: 9 bricks
      [0, 1, 1, 1, 1, 1, 1, 1, 0],      // Row 7: 7 bricks
      [0, 0, 1, 1, 1, 1, 1, 0, 0],      // Row 8: 5 bricks
      [0, 0, 0, 1, 1, 1, 0, 0, 0],      // Row 9: 3 bricks
    ];

    // Color pattern (mix of colors like reference)
    const colorPattern = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 2, 2, 2, 1, 1, 0],
      [1, 2, 2, 2, 3, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const colorMap = [
      { main: COLORS.lavender, shadow: "#6D5B7E", light: "#AB9BBE" },
      { main: COLORS.teal, shadow: "#3D9A84", light: "#7DCAB4" },
      { main: COLORS.orange, shadow: "#DF8346", light: "#FFC386" },
      { main: COLORS.deepTeal, shadow: "#1D4F4D", light: "#4D7F7D" },
    ];

    const brickColumnCount = 9;
    const totalWidth = brickColumnCount * (brickWidth + brickPadding) - brickPadding;
    const brickOffsetLeft = (canvas.width - totalWidth) / 2;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          const colorIndex = colorPattern[row][col];
          const colorSet = colorMap[colorIndex];
          
          bricks.push({
            x: brickOffsetLeft + col * (brickWidth + brickPadding),
            y: brickOffsetTop + row * (brickHeight + brickPadding),
            width: brickWidth,
            height: brickHeight,
            color: colorSet.main,
            shadowColor: colorSet.shadow,
            visible: true,
            alpha: 1,
            scale: 1,
            breaking: false,
          });
        }
      }
    }

    const particles: Particle[] = [];

    gameStateRef.current = {
      ball,
      paddle,
      bricks,
      particles,
      mouseX: canvas.width / 2,
      touchX: canvas.width / 2,
    };

    // Mouse/Touch controls - FIXED for proper drag control
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (gameStateRef.current) {
        gameStateRef.current.mouseX = e.clientX - rect.left;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      if (gameStateRef.current && e.touches[0]) {
        gameStateRef.current.touchX = e.touches[0].clientX - rect.left;
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
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Collision detection
    const checkBrickCollision = (ball: Ball, brick: Brick): boolean => {
      if (!brick.visible || brick.breaking) return false;

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

    // Create particles when brick breaks
    const createParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = 1.5 + Math.random() * 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          size: 2 + Math.random() * 2,
        });
      }
    };

    // Draw prominent paddle (Monument Valley style)
    const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
      const depth = 4;
      
      // Drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.roundRect(paddle.x + 2, paddle.y + depth + 2, paddle.width, paddle.height, 8);
      ctx.fill();

      // 3D depth
      for (let i = depth; i > 0; i--) {
        const progress = i / depth;
        ctx.fillStyle = `rgba(45, 95, 93, ${0.6 + progress * 0.4})`;
        ctx.beginPath();
        ctx.roundRect(paddle.x, paddle.y + i, paddle.width, paddle.height, 8);
        ctx.fill();
      }

      // Main paddle surface
      const gradient = ctx.createLinearGradient(
        paddle.x,
        paddle.y,
        paddle.x,
        paddle.y + paddle.height
      );
      gradient.addColorStop(0, "#3D7F7D");
      gradient.addColorStop(1, COLORS.paddle);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
      ctx.fill();

      // Highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.roundRect(paddle.x + 4, paddle.y + 2, paddle.width - 8, paddle.height / 2.5, 6);
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
      ctx.stroke();
    };

    // Draw premium ball with landing prediction
    const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
      // Landing prediction shadow (subtle)
      if (ball.dy > 0) {
        const distanceToBottom = paddle.y - ball.y;
        const timeToLand = distanceToBottom / ball.dy;
        const landingX = ball.x + ball.dx * timeToLand;
        
        if (timeToLand > 0 && timeToLand < 100) {
          ctx.fillStyle = "rgba(255, 163, 102, 0.15)";
          ctx.beginPath();
          ctx.ellipse(landingX, paddle.y - 5, ball.radius * 1.5, ball.radius * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Trail
      ball.trail.forEach((point, index) => {
        const alpha = point.alpha * (index / ball.trail.length) * 0.4;
        ctx.fillStyle = `rgba(255, 163, 102, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, ball.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Outer glow
      const outerGlow = ctx.createRadialGradient(
        ball.x,
        ball.y,
        0,
        ball.x,
        ball.y,
        ball.radius * 2.2
      );
      outerGlow.addColorStop(0, "rgba(255, 163, 102, 0.5)");
      outerGlow.addColorStop(1, "rgba(255, 163, 102, 0)");
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Main ball
      const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.3,
        ball.y - ball.radius * 0.3,
        0,
        ball.x,
        ball.y,
        ball.radius
      );
      gradient.addColorStop(0, "#FFB386");
      gradient.addColorStop(0.7, COLORS.ball);
      gradient.addColorStop(1, "#DF8346");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.35, ball.y - ball.radius * 0.35, ball.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Draw Monument Valley style bricks
    const drawBrick = (ctx: CanvasRenderingContext2D, brick: Brick) => {
      if (!brick.visible) return;

      ctx.save();
      ctx.globalAlpha = brick.alpha;

      const centerX = brick.x + brick.width / 2;
      const centerY = brick.y + brick.height / 2;
      
      if (brick.scale !== 1) {
        ctx.translate(centerX, centerY);
        ctx.scale(brick.scale, brick.scale);
        ctx.translate(-centerX, -centerY);
      }

      const depth = 3;

      // Drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.beginPath();
      ctx.roundRect(brick.x + 2, brick.y + depth + 2, brick.width, brick.height, 6);
      ctx.fill();

      // 3D depth layers
      for (let i = depth; i > 0; i--) {
        ctx.fillStyle = brick.shadowColor;
        ctx.globalAlpha = brick.alpha * (0.4 + (i / depth) * 0.3);
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y + i, brick.width, brick.height, 6);
        ctx.fill();
      }

      ctx.globalAlpha = brick.alpha;

      // Main surface with gradient
      const gradient = ctx.createLinearGradient(
        brick.x,
        brick.y,
        brick.x,
        brick.y + brick.height
      );
      gradient.addColorStop(0, brick.color);
      gradient.addColorStop(1, brick.shadowColor);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 6);
      ctx.fill();

      // Top highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.beginPath();
      ctx.roundRect(brick.x + 3, brick.y + 2, brick.width - 6, brick.height / 3, 4);
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 6);
      ctx.stroke();

      ctx.restore();
    };

    // Draw particles
    const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      particles.forEach((particle) => {
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx || !gameStateRef.current) return;

      const { ball, paddle, bricks, particles, mouseX, touchX } = gameStateRef.current;

      // Clear canvas with soft mint background (matching reference)
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update paddle position (smooth follow with easing) - IMPROVED
      const targetX = (touchX || mouseX) - paddle.width / 2;
      paddle.targetX = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
      
      // Faster response for better control
      paddle.x += (paddle.targetX - paddle.x) * 0.3; // Increased from 0.2 to 0.3
      
      // Ensure paddle stays in bounds
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));

      // Update ball trail
      ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 1 });
      if (ball.trail.length > 8) {
        ball.trail.pop();
      }
      ball.trail.forEach((point, index) => {
        point.alpha = 1 - index / ball.trail.length;
      });

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        // Vibration feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }

      // Paddle collision with better physics
      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.dy > 0
      ) {
        ball.dy = -Math.abs(ball.dy);
        
        // Add horizontal variation based on where ball hits paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        const angle = (hitPos - 0.5) * 1.2; // -0.6 to 0.6
        ball.dx = angle * 5;
        
        // Ensure minimum vertical speed
        if (Math.abs(ball.dy) < 2.5) {
          ball.dy = ball.dy > 0 ? 2.5 : -2.5;
        }
        
        // Vibration feedback
        if (navigator.vibrate) {
          navigator.vibrate(15);
        }
      }

      // Bottom boundary - GAME OVER if ball falls below paddle
      if (ball.y - ball.radius > paddle.y + paddle.height + 20) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const currentCleared = bricks.filter(b => !b.visible && !b.breaking).length;
        
        // Trigger game over
        setTimeout(() => {
          onFailed(currentCleared, timeSpent);
        }, 300);
        return;
      }

      // Brick collision with satisfying feedback
      let clearedThisFrame = 0;
      bricks.forEach((brick) => {
        if (checkBrickCollision(ball, brick)) {
          ball.dy = -ball.dy;
          brick.breaking = true;
          brick.visible = false;
          clearedThisFrame++;

          // Create particles
          createParticles(
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
            brick.color
          );

          // Scale animation
          brick.scale = 1.2;

          // Vibration feedback
          if (navigator.vibrate) {
            navigator.vibrate(20);
          }
        }

        // Animate breaking bricks
        if (brick.breaking) {
          brick.alpha -= 0.08;
          brick.scale += 0.05;
          if (brick.alpha <= 0) {
            brick.breaking = false;
          }
        }
      });

      if (clearedThisFrame > 0) {
        setBricksCleared((prev) => prev + clearedThisFrame);
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.alpha -= 0.02;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
        }
      }

      // Draw everything in correct order
      drawParticles(ctx, particles);
      bricks.forEach((brick) => drawBrick(ctx, brick));
      drawPaddle(ctx, paddle);
      drawBall(ctx, ball);

      // Check if all bricks cleared
      const allCleared = bricks.every((brick) => !brick.visible && !brick.breaking);
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
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete, onFailed]);

  return (
    <div className="relative h-full w-full" style={{ backgroundColor: "#D4E8E0" }}>
      {/* Counter - Fixed position below safe area (not floating) */}
      <div 
        className="absolute left-0 right-0 flex justify-center"
        style={{ 
          top: "env(safe-area-inset-top, 60px)",
          paddingTop: "20px"
        }}
      >
        <div className="rounded-full bg-white/30 px-5 py-2 backdrop-blur-sm">
          <p className="text-sm font-medium text-[#2D5F5D]">
            {bricksCleared} cleared
          </p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
