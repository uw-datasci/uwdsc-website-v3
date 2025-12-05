/* eslint-disable react/no-unknown-property */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface WormholeWithRingsProps {
  readonly partType: "top" | "middle" | "bottom";
}

interface CubeData {
  angle: number;
  speed: number;
  rotationSpeed: { x: number; y: number; z: number };
}

// Component to render your custom cube model
function CustomCube({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const { scene } = useGLTF("/models/Watercube.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function WormholeWithRings({ partType }: WormholeWithRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cubeGroupRefs = useRef<(THREE.Group | null)[]>([]);

  // Define wormhole geometry based on part type
  const wormholeGeometry = useMemo(() => {
    if (partType === "top") {
      return {
        height: 45,
        frontRadius: 15,
        backRadius: 56,
        curve: 4,
        perspective: "down",
        frontHeight: 15,
        backHeight: 30,
      };
    } else if (partType === "middle") {
      return {
        height: 40,
        frontRadius: 11,
        backRadius: 9,
        curve: 0.2,
        perspective: "middle",
      };
    } else {
      return {
        height: 25,
        frontRadius: 10,
        backRadius: 80,
        curve: 4.5,
        perspective: "down",
        frontHeight: 15,
        backHeight: 30,
      };
    }
  }, [partType]);

  // Function to calculate radius at any Y position
  const getRadiusAtY = (y: number) => {
    const t = y / (wormholeGeometry.height * 0.5);

    if (partType === "top") {
      const depth = (t + 1.0) * 0.5;
      const curvedDepth = Math.pow(depth, wormholeGeometry.curve);
      return (
        (wormholeGeometry.frontRadius || 3) +
        ((wormholeGeometry.backRadius || 15) -
          (wormholeGeometry.frontRadius || 3)) *
          curvedDepth
      );
    } else if (partType === "middle") {
      const normalizedT = (t + 1.0) * 0.5;
      const centerCurve = 1.0 - Math.sin(normalizedT * Math.PI);
      const radius =
        (wormholeGeometry.backRadius || 2.8) +
        ((wormholeGeometry.frontRadius || 3.2) -
          (wormholeGeometry.backRadius || 2.8)) *
          centerCurve;
      return radius;
    } else {
      const depth = (t + 1.0) * 0.5;
      const curvedDepth = Math.pow(depth, wormholeGeometry.curve);
      return (
        (wormholeGeometry.frontRadius || 3) +
        ((wormholeGeometry.backRadius || 30) -
          (wormholeGeometry.frontRadius || 3)) *
          curvedDepth
      );
    }
  };

  // Create wormhole grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.Line[] = [];
    const numLines = 9;
    const segments = 30;

    // Vertical lines
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const points: THREE.Vector3[] = [];

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
      const isDashed = i % 3 === 0;

      const material = isDashed
        ? new THREE.LineDashedMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            dashSize: 0.5,
            gapSize: 0.3,
          })
        : new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
          });

      const line = new THREE.Line(geometry, material);
      if (isDashed) {
        line.computeLineDistances();
      }

      lines.push(line);
    }

    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partType, wormholeGeometry]);

  // Create moving rings that follow wormhole shape
  const rings = useMemo(() => {
    const ringArray: THREE.Line[] = [];
    const numRings = 8;

    for (let i = 0; i < numRings; i++) {
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const x = Math.cos(angle);
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

  // Create cube data for animation - use ref to persist across frames
  const cubeData = useRef<CubeData[]>(
    Array.from({ length: 8 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.02,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05,
      },
    }))
  );

  // Helper function to calculate animated Y position
  const calculateAnimatedY = (
    elapsedTime: number,
    speed: number,
    offset: number
  ): number => {
    const progress =
      (elapsedTime * speed * wormholeGeometry.height + offset) %
      wormholeGeometry.height;

    if (partType === "bottom") {
      return -(wormholeGeometry.height * 0.5) + progress;
    }
    return wormholeGeometry.height * 0.5 - progress;
  };

  // Helper function to update ring animation
  const updateRing = (
    ring: THREE.Line,
    animatedY: number,
    halfHeight: number
  ): void => {
    if (Math.abs(animatedY) > halfHeight) {
      ring.visible = false;
      return;
    }

    ring.visible = true;
    const radius = getRadiusAtY(animatedY);
    ring.position.y = animatedY;
    ring.scale.setScalar(radius);

    const edgeDistance = Math.abs(animatedY) / halfHeight;
    const fadeZone = 0.1;
    let opacity = 0.9;

    if (edgeDistance > 1.0 - fadeZone) {
      const fadeProgress = (edgeDistance - (1.0 - fadeZone)) / fadeZone;
      opacity = 0.9 * (1.0 - fadeProgress);
    }

    (ring.material as THREE.LineBasicMaterial).opacity = Math.max(opacity, 0);
  };

  // Animate the rings and cubes
  useFrame((state) => {
    const halfHeight = wormholeGeometry.height * 0.5;

    // Animate rings
    for (const [index, ring] of rings.entries()) {
      const speed = 0.05;
      const offset = (index / rings.length) * wormholeGeometry.height;
      const animatedY = calculateAnimatedY(
        state.clock.elapsedTime,
        speed,
        offset
      );
      updateRing(ring, animatedY, halfHeight);
    }

    // Animate cubes using refs
    cubeData.current.forEach((data, index) => {
      const cubeGroup = cubeGroupRefs.current[index];
      if (!cubeGroup) return;

      const offset =
        (index / cubeData.current.length) * wormholeGeometry.height;
      const animatedY = calculateAnimatedY(
        state.clock.elapsedTime,
        data.speed,
        offset
      );

      // Check if cube should be visible
      if (Math.abs(animatedY) > halfHeight) {
        cubeGroup.visible = false;
        return;
      }

      cubeGroup.visible = true;
      const radius = getRadiusAtY(animatedY);

      // Update angle for spiral motion
      data.angle += data.speed * 0.5;

      const spiralRadius = radius * (0.3 + Math.sin(animatedY * 0.1) * 0.2);
      const x = Math.cos(data.angle) * spiralRadius;
      const z = Math.sin(data.angle) * spiralRadius;

      // Update position
      cubeGroup.position.set(x, animatedY, z);

      // Update rotation
      cubeGroup.rotation.x += data.rotationSpeed.x;
      cubeGroup.rotation.y += data.rotationSpeed.y;
      cubeGroup.rotation.z += data.rotationSpeed.z;

      // Calculate opacity based on distance from edges
      const edgeDistance = Math.abs(animatedY) / halfHeight;
      const fadeZone = 0.15;
      let opacity = 0.8;

      if (edgeDistance > 1.0 - fadeZone) {
        const fadeProgress = (edgeDistance - (1.0 - fadeZone)) / fadeZone;
        opacity = 0.8 * (1.0 - fadeProgress);
      }

      // Apply opacity to all materials in the cube
      cubeGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = Math.max(opacity, 0);
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = Math.max(opacity, 0);
          }
        }
      });
    });
  });

  let rotation: [number, number, number];
  switch (partType) {
    case "top":
      rotation = [Math.PI * 0.15, 0, 0];
      break;
    case "bottom":
      rotation = [-Math.PI * 0.15, 0, Math.PI];
      break;
    default:
      rotation = [0, 0, 0];
  }

  return (
    <group ref={groupRef} rotation={rotation}>
      {/* Wormhole grid structure */}
      {gridLines.map((line, index) => (
        <primitive key={`line-${index}`} object={line} />
      ))}

      {/* Moving rings */}
      {rings.map((ring, index) => (
        <primitive key={`ring-${index}`} object={ring} />
      ))}

      {/* Custom WaterCubes */}
      {cubeData.current.map((_, index) => (
        <group
          key={`cube-${index}`}
          ref={(el) => {
            cubeGroupRefs.current[index] = el;
          }}
        >
          <CustomCube position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.5} />
        </group>
      ))}
    </group>
  );
}

export function WormholeTop() {
  return (
    <div className="block h-[18vh] sm:h-[35vh] lg:h-[45vh] overflow-hidden -z-10">
      <div className="transform -translate-y-[20%] h-[40vh] sm:h-[75vh] lg:h-[100vh]">
        <Canvas
          camera={{ position: [0, -0.8, 40], fov: 75 }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <WormholeWithRings partType="top" />
        </Canvas>
      </div>
    </div>
  );
}

export function WormholeMiddle() {
  return (
    <div className="block h-[25vh] sm:h-[45vh] lg:h-[55vh] overflow-hidden -z-10">
      <div className="transform -translate-y-[20%] h-[40vh] sm:h-[75vh] lg:h-[100vh]">
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <WormholeWithRings partType="middle" />
        </Canvas>
      </div>
    </div>
  );
}

export function WormholeBottom() {
  return (
    <div className="block h-[25vh] sm:h-[45vh] lg:h-[60vh] overflow-hidden -z-10">
      <div className="transform -translate-y-[40%] h-[40vh] sm:h-[75vh] lg:h-[100vh]">
        <Canvas
          camera={{ position: [0, -2, -30], fov: 75 }}
          onCreated={({ camera }) => camera.lookAt(0, 0, -20)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <WormholeWithRings partType="bottom" />
        </Canvas>
      </div>
    </div>
  );
}
