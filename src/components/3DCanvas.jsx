import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Same base as body — fills left ~50vw so no “two-tone” seam with page background */
const BG_BOTTOM = '#0d1026';
const FOG_COLOR = '#0d1026';

function makeTetraData() {
  const items = [];
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* Slightly looser layout + faster spin (readability) set in TetrahedronMesh */
  for (let i = 0; i < 46; i += 1) {
    items.push({
      base: new THREE.Vector3(
        rnd(-4.55, 2.45),
        rnd(-4.5, 4.5),
        rnd(-6.25, -0.35)
      ),
      scale: rnd(0.26, 0.72),
      rotAxis: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize(),
      rotSpeed: rnd(0.12, 0.32),
      phase: rnd(0, Math.PI * 2),
    });
  }

  return items;
}

function buildPairs(bases, maxDist) {
  const pairs = [];
  const n = bases.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (bases[i].distanceTo(bases[j]) < maxDist) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}

const quat = new THREE.Quaternion();

function TetrahedronMesh({ data }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const m = meshRef.current;
    if (!m) return;
    quat.setFromAxisAngle(data.rotAxis, t * data.rotSpeed + data.phase);
    m.quaternion.copy(quat);
    const bob = Math.sin(t * 0.9 + data.phase) * 0.16;
    m.position.set(data.base.x, data.base.y + bob, data.base.z);
  });

  return (
    <mesh ref={meshRef} scale={data.scale}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#9b8ad4"
        emissive="#4c1d95"
        emissiveIntensity={0.34}
        metalness={0.7}
        roughness={0.22}
        clearcoat={0.88}
        clearcoatRoughness={0.12}
        reflectivity={1}
        envMapIntensity={1}
        flatShading
      />
    </mesh>
  );
}

function PlexusLines({ bases, pairs }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(pairs.length * 6);
    let idx = 0;
    for (const [i, j] of pairs) {
      const a = bases[i];
      const b = bases[j];
      positions[idx++] = a.x;
      positions[idx++] = a.y;
      positions[idx++] = a.z;
      positions[idx++] = b.x;
      positions[idx++] = b.y;
      positions[idx++] = b.z;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [bases, pairs]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#b8a3f0"
        transparent
        opacity={0.26}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function SceneContent() {
  const tetraData = useMemo(() => makeTetraData(), []);
  const bases = useMemo(
    () => tetraData.map((d) => d.base.clone()),
    [tetraData]
  );
  /* Lower max distance = only nearby nodes link → shapes feel a bit more “apart” */
  const pairs = useMemo(() => buildPairs(bases, 2.72), [bases]);

  return (
    <>
      <color attach="background" args={[BG_BOTTOM]} />
      <fog attach="fog" args={[FOG_COLOR, 6, 36]} />

      <hemisphereLight args={['#1e1b4b', '#0f0a1a', 0.52]} />
      <ambientLight intensity={0.22} color="#e9d5ff" />

      <directionalLight position={[9, 11, 6]} intensity={2.1} color="#faf5ff" />
      <directionalLight position={[2, 5, 9]} intensity={0.38} color="#818cf8" />

      <pointLight position={[3, 2, 2]} intensity={0.95} color="#f5f3ff" distance={24} decay={2} />
      <pointLight position={[-2, -2, 0]} intensity={0.48} color="#6d28d9" distance={18} decay={2} />

      <group position={[-0.85, 0, 0]} scale={1.42}>
        <PlexusLines bases={bases} pairs={pairs} />
        {tetraData.map((data, i) => (
          <TetrahedronMesh key={i} data={data} />
        ))}
      </group>
    </>
  );
}

export default function CanvasContainer() {
  return (
    <div className="three-bg-wrap">
      <Canvas
        className="three-bg-canvas"
        camera={{ position: [0.15, 0, 6.85], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.94;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(BG_BOTTOM, 0);
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
