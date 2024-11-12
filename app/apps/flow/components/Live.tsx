// app/apps/flow/components/Live.tsx
"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useOthers } from "@/liveblocks.config";
import { LiveMap } from "@liveblocks/client";

export const Live = () => {
  const others = useOthers();
  const [viewportTransform, setViewportTransform] = useState<number[]>([
    1, 0, 0, 1, 0, 0,
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-apply transform when resizing
        if (ctx) {
          ctx.setTransform(
            viewportTransform[0],
            viewportTransform[1],
            viewportTransform[2],
            viewportTransform[3],
            viewportTransform[4],
            viewportTransform[5]
          );
        }
      }
    };

    // Initial size
    handleResize();

    // Handle panning
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.altKey) {
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newTransform = [...viewportTransform];
      newTransform[4] += dx;
      newTransform[5] += dy;

      setViewportTransform(newTransform);

      if (ctx) {
        ctx.setTransform(
          newTransform[0],
          newTransform[1],
          newTransform[2],
          newTransform[3],
          newTransform[4],
          newTransform[5]
        );
      }

      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      isPanning = false;
      canvas.style.cursor = "default";
    };

    // Attach event listeners
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [viewportTransform]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="fixed top-4 right-20 text-[#cccccc]/70 text-xs">
        {others.length} other user{others.length === 1 ? "" : "s"} present
      </div>
    </>
  );
};
