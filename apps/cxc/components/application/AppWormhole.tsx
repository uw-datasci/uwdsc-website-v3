"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface AppWormholeProps {
  opacity?: number;
}

function WormholeWithRings() {
  const groupRef = useRef<THREE.Group>(null);

  // Define wormhole geometry based on part type
  const wormholeGeometry = useMemo(() => {
    return {
      height: 70,
      frontRadius: 12,
      backRadius: 30,
      curve: 2.5,
      perspective: "down",
      frontHeight: 15,
      backHeight: 30,
    };
  }, []);

  // Function to calculate radius at any Y position
  const getRadiusAtY = (y: number) => {
    const t = y / (wormholeGeometry.height * 0.5);

    const depth = (t + 1.0) * 0.5;
    const curvedDepth = Math.pow(depth, wormholeGeometry.curve);
    return (
      (wormholeGeometry.frontRadius || 3) +
      ((wormholeGeometry.backRadius || 15) -
        (wormholeGeometry.frontRadius || 3)) *
        curvedDepth
    );
  };

  // Create wormhole grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.Line[] = [];
    const numLines = 10;
    const segments = 50;

    // Vertical lines
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const points = [];

      for (let j = 0; j <= segments; j++) {
        const y =
          wormholeGeometry.height * 0.5 -
          (j / segments) * wormholeGeometry.height;
        const radius = getRadiusAtY(y);

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
      });

      const line = new THREE.Line(geometry, material);
      lines.push(line);
    }

    return lines;
  }, [wormholeGeometry]);

  // Create moving rings that follow wormhole shape
  const rings = useMemo(() => {
    const ringArray: THREE.Line[] = [];
    const numRings = 14;

    for (let i = 0; i < numRings; i++) {
      const points = [];
      const segments = 64;
      const radiusX = 1;

      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radiusX;
        const y = 0;
        const z = Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        linewidth: 1,
      });

      const ring = new THREE.Line(geometry, material);
      ringArray.push(ring);
    }

    return ringArray;
  }, []);

  // Animate the rings to follow wormhole shape
  useFrame((state) => {
    rings.forEach((ring, index) => {
      const speed = 0.05;
      const offset = (index / rings.length) * wormholeGeometry.height;

      let animatedY;
      animatedY =
        wormholeGeometry.height * 0.5 -
        ((state.clock.elapsedTime * speed * wormholeGeometry.height + offset) %
          wormholeGeometry.height);

      // Only show rings within the wormhole bounds to prevent deformation
      const halfHeight = wormholeGeometry.height * 0.5;
      if (Math.abs(animatedY) > halfHeight) {
        ring.visible = false;
        return;
      }

      ring.visible = true;

      // Get radius at this Y position to match wormhole shape
      const radius = getRadiusAtY(animatedY);

      // Position ring
      ring.position.y = animatedY;

      // Scale ring to match wormhole radius while preserving elliptical shape
      ring.scale.setScalar(radius);

      // Smooth fade at edges instead of abrupt opacity changes
      const edgeDistance = Math.abs(animatedY) / halfHeight;
      const fadeZone = 0.1;
      let opacity = 0.9;

      if (edgeDistance > 1.0 - fadeZone) {
        const fadeProgress = (edgeDistance - (1.0 - fadeZone)) / fadeZone;
        opacity = 0.9 * (1.0 - fadeProgress);
      }

      (ring.material as THREE.LineBasicMaterial).opacity = Math.max(opacity, 0);
    });
  });

  return (
    <group
      ref={groupRef}
      rotation={[Math.PI * 0.15, 0, 0]}
      position={[3, 0, 0]}
    >
      {/* Wormhole grid structure */}
      {gridLines.map((line, index) => (
        <primitive key={`line-${index}`} object={line} />
      ))}

      {/* Moving rings */}
      {rings.map((ring, index) => (
        <primitive key={`ring-${index}`} object={ring} />
      ))}
    </group>
  );
}

export function DesktopAppWormhole({ opacity = 1 }: AppWormholeProps) {
  return (
    <div className="block h-full overflow-hidden -z-10" style={{ opacity }}>
      <div className="h-[135vh]">
        <Canvas
          camera={{ position: [-12, 45, 0], fov: 50 }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <WormholeWithRings />
        </Canvas>
      </div>
    </div>
  );
}

export function MobileAppWormhole({ opacity = 1 }: AppWormholeProps) {
  return (
    <div className="block h-full overflow-hidden -z-1" style={{ opacity }}>
      <div className="h-[110vh]">
        <Canvas
          camera={{ position: [-0.75, 75, -0.5], fov: 45 }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <WormholeWithRings />
        </Canvas>
      </div>
    </div>
  );
}
