import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BG_BOTTOM = '#f5f7fb';
const FOG_COLOR = '#f5f7fb';

const BUBBLE_PALETTE = [
  { color: '#0056d2', emissive: '#0056d2', opacity: 0.55 },
  { color: '#2f7de1', emissive: '#378edd', opacity: 0.5 },
  { color: '#378edd', emissive: '#2f7de1', opacity: 0.48 },
  { color: '#0044a8', emissive: '#0056d2', opacity: 0.52 },
  { color: '#FF6BA8', emissive: '#378edd', opacity: 0.42 },
];

function makeBubbleData() {
  const items = [];
  const rnd = (a, b) => a + Math.random() * (b - a);

  for (let i = 0; i < 8; i += 1) {
    const depth = rnd(0.35, 1);
    items.push({
      base: new THREE.Vector3(rnd(-5.2, 2.8), rnd(-3.8, 3.8), rnd(-8.5, -1.2)),
      scale: rnd(0.95, 2.05) * (0.65 + depth * 0.55),
      depth,
      phase: rnd(0, Math.PI * 2),
      floatSpeed: rnd(0.28, 0.55),
      driftX: rnd(0.08, 0.22),
      driftY: rnd(0.12, 0.32),
      rotSpeed: rnd(0.05, 0.14),
      palette: BUBBLE_PALETTE[i % BUBBLE_PALETTE.length],
      isHero: true,
    });
  }

  for (let i = 0; i < 24; i += 1) {
    const depth = rnd(0.2, 1);
    items.push({
      base: new THREE.Vector3(rnd(-5.5, 3.2), rnd(-4.6, 4.6), rnd(-9.5, -0.4)),
      scale: rnd(0.22, 0.78) * (0.55 + depth * 0.7),
      depth,
      phase: rnd(0, Math.PI * 2),
      floatSpeed: rnd(0.35, 0.75),
      driftX: rnd(0.1, 0.28),
      driftY: rnd(0.15, 0.4),
      rotSpeed: rnd(0.08, 0.22),
      palette: BUBBLE_PALETTE[i % BUBBLE_PALETTE.length],
      isHero: false,
    });
  }

  return items;
}

function BubbleMesh({ data, mouse }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const highlightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const m = meshRef.current;
    if (!m) return;

    const parallaxStrength = 0.55 + data.depth * 1.15;
    const mx = (mouse.current?.x || 0) * parallaxStrength * 0.85;
    const my = (mouse.current?.y || 0) * parallaxStrength * 0.55;

    const bobY = Math.sin(t * data.floatSpeed + data.phase) * data.driftY;
    const bobX = Math.cos(t * data.floatSpeed * 0.72 + data.phase) * data.driftX;
    const bobZ = Math.sin(t * 0.22 + data.phase) * 0.12 * data.depth;

    m.position.set(
      data.base.x + bobX + mx,
      data.base.y + bobY + my,
      data.base.z + bobZ
    );
    m.rotation.y = t * data.rotSpeed + data.phase;
    m.rotation.x = Math.sin(t * 0.35 + data.phase) * 0.15;

    if (glowRef.current) {
      glowRef.current.position.copy(m.position);
      const pulse = 1 + Math.sin(t * 1.1 + data.phase) * 0.08;
      glowRef.current.scale.setScalar(data.scale * 1.35 * pulse);
    }

    if (highlightRef.current) {
      highlightRef.current.position.set(
        m.position.x - data.scale * 0.28,
        m.position.y + data.scale * 0.32,
        m.position.z + data.scale * 0.55
      );
    }
  });

  const { color, emissive, opacity } = data.palette;

  return (
    <>
      <mesh ref={meshRef} scale={data.scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={data.isHero ? 0.85 : 0.55}
          metalness={0.05}
          roughness={0.25}
          transparent
          opacity={opacity}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          reflectivity={0.7}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={glowRef} scale={data.scale * 1.3}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={data.isHero ? 0.16 : 0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={highlightRef} scale={data.scale * 0.22}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function SoftGlowOrbs() {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.08) * 0.12;
    group.current.position.y = Math.sin(t * 0.25) * 0.2;
  });

  return (
    <group ref={group}>
      <mesh position={[-1.2, 0.8, -6]}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color="#378edd"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[1.5, -1.4, -7.5]}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial
          color="#0056d2"
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ParallaxSmoother({ mouse }) {
  useFrame(() => {
    mouse.current.x += ((mouse.current.targetX || 0) - mouse.current.x) * 0.06;
    mouse.current.y += ((mouse.current.targetY || 0) - mouse.current.y) * 0.06;
  });
  return null;
}

function SceneContent({ mouse }) {
  const bubbleData = useMemo(() => makeBubbleData(), []);

  return (
    <>
      <color attach="background" args={[BG_BOTTOM]} />
      <fog attach="fog" args={[FOG_COLOR, 7, 28]} />

      <hemisphereLight args={['#d9d9d9', '#f5f7fb', 0.7]} />
      <ambientLight intensity={0.35} color="#FFB4D4" />

      <directionalLight position={[8, 10, 5]} intensity={1.7} color="#FFE4F0" />
      <directionalLight position={[-4, 3, 6]} intensity={0.55} color="#2f7de1" />

      <pointLight position={[2.5, 2, 1]} intensity={1.35} color="#378edd" distance={26} decay={2} />
      <pointLight position={[-2.5, -1.5, -1]} intensity={0.85} color="#0056d2" distance={20} decay={2} />
      <pointLight position={[0, 3, -4]} intensity={0.65} color="#2f7de1" distance={22} decay={2} />

      <ParallaxSmoother mouse={mouse} />
      <SoftGlowOrbs />

      <group position={[-0.55, 0, 0]} scale={1.35}>
        {bubbleData.map((data, i) => (
          <BubbleMesh key={i} data={data} mouse={mouse} />
        ))}
      </group>
    </>
  );
}

export default function CanvasContainer() {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2.4;
      mouse.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 1.6;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="three-bg-wrap">
      <Canvas
        className="three-bg-canvas"
        camera={{ position: [0.2, 0, 7.2], fov: 46 }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(BG_BOTTOM, 0);
        }}
      >
        <SceneContent mouse={mouse} />
      </Canvas>
    </div>
  );
}
