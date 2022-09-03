/*
 * @Author: holakk
 * @Date: 2022-02-26 17:20:24
 * @LastEditors: holakk
 * @LastEditTime: 2022-03-01 23:09:46
 * @Description: file content
 */

import { useEffect, useRef } from "react";

class Star {
  orbitRadius: number;
  starRadius: number;
  alpha: number;
  speed: number;
  angle: number;
  starX!: number;
  starY!: number;
  constructor() {
    this.orbitRadius = Math.floor(
      Math.random() *
        Math.round(
          Math.sqrt(
            window.innerWidth * window.innerWidth +
              window.innerHeight * window.innerHeight
          ) / 2
        ) +
        1
    );
    this.starRadius =
      Math.floor(Math.random() * (this.orbitRadius - 50 + 1) + 50) / 12;
    this.alpha = Math.floor(Math.random() * 9 + 2) / 10;
    this.speed = Math.floor(Math.random() * this.orbitRadius) / 50000;
    this.angle = Math.random() * 2 * Math.PI;
  }
  draw(ctx: CanvasRenderingContext2D, baseStarCanvas: HTMLCanvasElement) {
    this.starX =
      Math.sin(this.angle) * this.orbitRadius + window.innerWidth / 2;
    this.starY =
      Math.cos(this.angle) * this.orbitRadius + window.innerHeight / 2;
    // 闪烁
    let blink = Math.floor(Math.random() * 10);
    if (blink <= 4) {
      if (this.alpha > 0.1 && blink >= 2) {
        this.alpha -= 0.05;
      } else if (this.alpha < 1) {
        this.alpha += 0.05;
      }
    }

    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      baseStarCanvas,
      this.starX - this.starRadius,
      this.starY - this.starRadius,
      this.starRadius * 2,
      this.starRadius * 2
    );
    this.angle += this.speed;
  }
}

export function DiffusePlanet() {
  const maxStars = 1000;
  const stars: Star[] = [];
  const canvasRef = useRef<HTMLCanvasElement>(null),
    starRef = useRef<HTMLCanvasElement>(null);
  const baseStar = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.1, "hsl(217, 61%, 33%)");
    gradient.addColorStop(0.25, "hsl(217, 64%, 6%)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2); //画一个圆（x,y,半径，起始弧度，结束弧度）
    ctx.fill();
  };
  useEffect(() => {
    if (canvasRef.current !== null && starRef.current !== null) {
      baseStar(starRef.current.getContext("2d")!);
      const ctx: CanvasRenderingContext2D = canvasRef.current.getContext("2d")!;
      for (let i = 0; i < maxStars; i++) {
        stars.push(new Star());
      }
      function animation() {
        ctx.globalCompositeOperation = "source-over"; //图像合成，源图形不透明地方显示源图形，其余显示目标图形
        ctx.globalAlpha = 0.8; //图像透明度
        ctx.fillStyle = "hsla(217, 64%, 6%, 1)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.globalCompositeOperation = "lighter"; //显示源图像+目标图像
        stars.forEach((star) => star.draw(ctx, starRef.current!));
        window.requestAnimationFrame(animation);
      }
      animation();
    }
  }, [canvasRef, starRef]);
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}>
      <canvas ref={starRef} width={100} height={100}></canvas>
    </canvas>
  );
}

export default {
  DiffusePlanet,
};
