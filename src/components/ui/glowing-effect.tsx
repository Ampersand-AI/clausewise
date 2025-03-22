
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  disabled?: boolean;
  glow?: boolean;
  proximity?: number;
  spread?: number;
  borderWidth?: number;
  inactiveZone?: number;
  className?: string;
}

export function GlowingEffect({
  disabled = false,
  glow = true,
  proximity = 120,
  spread = 32,
  borderWidth = 2,
  inactiveZone = 0.02,
  className,
  ...props
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [opacity, setOpacity] = useState<number>(0);
  const [borderRadius, setBorderRadius] = useState<string>("0px");
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [clipPath, setClipPath] = useState<string>("");

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
      setBorderRadius(
        window.getComputedStyle(containerRef.current).borderRadius
      );
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (containerRef.current && !disabled) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate the distance from the center as a percentage of proximity
        const distanceX = Math.abs(x - centerX) / (proximity / 2);
        const distanceY = Math.abs(y - centerY) / (proximity / 2);

        // Ensure we are within the active zone
        if (
          x < rect.width * inactiveZone ||
          x > rect.width * (1 - inactiveZone) ||
          y < rect.height * inactiveZone ||
          y > rect.height * (1 - inactiveZone)
        ) {
          setOpacity(0);
          return;
        }

        // If we are close enough to the center, show the glow
        if (distanceX <= 1 && distanceY <= 1) {
          setPosition({ x, y });
          setOpacity(1 - Math.max(distanceX, distanceY));
        } else {
          setOpacity(0);
        }
      }
    },
    [proximity, disabled, inactiveZone]
  );

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  useEffect(() => {
    // Ensure the clip-path is updated when the borderRadius changes
    if (borderRadius !== "0px") {
      if (borderRadius.includes(" ")) {
        setClipPath(`border-box`);
      } else {
        setClipPath(`border-box`);
      }
    }
  }, [borderRadius]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        borderRadius,
      }}
      {...props}
    >
      {glow && (
        <div
          className="absolute transform rounded-full bg-white"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${spread * 2}px`,
            height: `${spread * 2}px`,
            marginLeft: `-${spread}px`,
            marginTop: `-${spread}px`,
            opacity: opacity,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        className="absolute inset-0 transform"
        style={{
          clipPath,
          WebkitMaskImage: `-webkit-radial-gradient(white, black)`,
          pointerEvents: "none",
        }}
      >
        <div
          className="absolute inset-[-1000px] transform"
          style={{
            opacity: !disabled ? opacity : 0,
            background:
              "conic-gradient(from 315deg, purple, cyan, yellow, purple)",
            inset: `-${borderWidth}px`,
            animationName: "rotate",
            animationDuration: "5s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
      </div>
    </div>
  );
}
