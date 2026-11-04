import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface GoldenLedgerProps {
  isEntering?: boolean;
  onEntered?: () => void;
  size?: 'hero' | 'compact' | 'nav';
}

// ---------------------------------------------------------------------
// Helper: Construct an Architectural Curved Metallic Sheet with Thickness
// Generates front, back, and edge faces with smooth normals
// ---------------------------------------------------------------------
function createCurvedSheetGeometry(
  width: number,
  height: number,
  thickness: number,
  curvatureFactor: number,
  twistFactor: number,
  archOffset: number
): THREE.BufferGeometry {
  const uSegments = 40;
  const vSegments = 50;

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Generate 2 layers of vertices: layer 0 (front, +thickness/2) and layer 1 (back, -thickness/2)
  for (let layer = 0; layer < 2; layer++) {
    const normalSign = layer === 0 ? 1 : -1;
    const layerOffset = (thickness / 2) * normalSign;

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments; // 0 to 1
      const y = (v - 0.5) * height;

      // Vertical taper: slightly wider at the mid-section
      const taper = Math.sin(v * Math.PI) * 0.15 + 0.85;
      const currentWidth = width * taper;

      // Progressive twist along vertical axis
      const twist = (v - 0.5) * twistFactor;

      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments; // 0 to 1
        const xLocal = (u - 0.5) * currentWidth;

        // Controlled parabolic and harmonic curvature (like an open ledger sheet)
        const bend =
          Math.sin(u * Math.PI * 0.85 + archOffset) * curvatureFactor * width -
          Math.pow((v - 0.5), 2) * 0.15;

        // Apply twist
        const cosT = Math.cos(twist);
        const sinT = Math.sin(twist);
        const xRot = xLocal * cosT - bend * sinT;
        const zRot = xLocal * sinT + bend * cosT;

        // Add thickness offset along approximate normal (Z)
        const xFinal = xRot - sinT * layerOffset;
        const yFinal = y;
        const zFinal = zRot + cosT * layerOffset;

        positions.push(xFinal, yFinal, zFinal);
        normals.push(0, 0, normalSign);
      }
    }
  }

  const stride = (uSegments + 1) * (vSegments + 1);

  // Front faces (layer 0)
  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = (j + 1) * (uSegments + 1) + i;
      const c = (j + 1) * (uSegments + 1) + (i + 1);
      const d = j * (uSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Back faces (layer 1, reversed winding)
  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = stride + j * (uSegments + 1) + i;
      const b = stride + (j + 1) * (uSegments + 1) + i;
      const c = stride + (j + 1) * (uSegments + 1) + (i + 1);
      const d = stride + j * (uSegments + 1) + (i + 1);

      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Edge ribbon: Left edge (i = 0)
  for (let j = 0; j < vSegments; j++) {
    const f1 = j * (uSegments + 1);
    const f2 = (j + 1) * (uSegments + 1);
    const b1 = stride + f1;
    const b2 = stride + f2;
    indices.push(f1, b1, f2);
    indices.push(f2, b1, b2);
  }

  // Edge ribbon: Right edge (i = uSegments)
  for (let j = 0; j < vSegments; j++) {
    const f1 = j * (uSegments + 1) + uSegments;
    const f2 = (j + 1) * (uSegments + 1) + uSegments;
    const b1 = stride + f1;
    const b2 = stride + f2;
    indices.push(f1, f2, b1);
    indices.push(f2, b2, b1);
  }

  // Edge ribbon: Top edge (j = vSegments)
  for (let i = 0; i < uSegments; i++) {
    const f1 = vSegments * (uSegments + 1) + i;
    const f2 = f1 + 1;
    const b1 = stride + f1;
    const b2 = stride + f2;
    indices.push(f1, f2, b1);
    indices.push(f2, b2, b1);
  }

  // Edge ribbon: Bottom edge (j = 0)
  for (let i = 0; i < uSegments; i++) {
    const f1 = i;
    const f2 = i + 1;
    const b1 = stride + f1;
    const b2 = stride + f2;
    indices.push(f1, b1, f2);
    indices.push(f2, b1, b2);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

// ---------------------------------------------------------------------
// The Golden Ledger Installation: 2 Flowing Curving Sheets & Axis Spine
// ---------------------------------------------------------------------
function LedgerSculptureSubject({
  isEntering,
  onEntered,
  isHero,
}: {
  isEntering?: boolean;
  onEntered?: () => void;
  isHero?: boolean;
}) {
  const masterGroupRef = useRef<THREE.Group>(null);
  const leaf1Ref = useRef<THREE.Mesh>(null);
  const leaf2Ref = useRef<THREE.Mesh>(null);
  const spineRef = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.PointLight>(null);

  // 1. Primary Sheet: Polished Champagne Gold
  const leaf1Geo = useMemo(
    () => createCurvedSheetGeometry(1.5, 2.3, 0.038, 0.32, 0.28, 0.15),
    []
  );

  // 2. Counter Sheet: Antique Gold with contrasting fold & curvature
  const leaf2Geo = useMemo(
    () => createCurvedSheetGeometry(1.25, 1.95, 0.034, -0.38, -0.32, 0.4),
    []
  );

  // 3. Central Axis Spine & Balance Jewel
  const spineGeo = useMemo(() => new THREE.CylinderGeometry(0.018, 0.012, 2.6, 24), []);
  const jewelGeo = useMemo(() => new THREE.OctahedronGeometry(0.08, 0), []);

  // Material 1: Champagne Gold (Luminous, refined specular, zero plastic yellow)
  const champagneMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D6B77A'),
        metalness: 0.86,
        roughness: 0.18,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        emissive: new THREE.Color('#3A240F'),
        emissiveIntensity: 0.35,
        reflectivity: 0.95,
      }),
    []
  );

  // Material 2: Antique Gold / Polished Brass (Warmer tone for layered contrast)
  const antiqueMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#A77B36'),
        metalness: 0.88,
        roughness: 0.22,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        emissive: new THREE.Color('#2E1909'),
        emissiveIntensity: 0.3,
        reflectivity: 0.9,
      }),
    []
  );

  const transitionTimerRef = useRef(0);

  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    if (!isEntering) {
      // Slow, majestic gallery idle rotation
      masterGroupRef.current.rotation.y += delta * 0.12;

      // Weightless natural breathing float
      const t = state.clock.getElapsedTime();
      masterGroupRef.current.position.y = (isHero ? 0.05 : 0) + Math.sin(t * 0.6) * 0.04;

      // Responsive cursor parallax
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        state.pointer.y * 0.1,
        0.03
      );
      masterGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.z,
        state.pointer.x * 0.08,
        0.03
      );
    } else {
      // 2.2-second smooth transition
      transitionTimerRef.current += delta;
      const progress = Math.min(transitionTimerRef.current / 2.2, 1.0);

      // Leaves gently fan outward like an opening architectural ledger
      if (leaf1Ref.current) {
        leaf1Ref.current.rotation.y = THREE.MathUtils.lerp(leaf1Ref.current.rotation.y, 0.45, delta * 2.5);
      }
      if (leaf2Ref.current) {
        leaf2Ref.current.rotation.y = THREE.MathUtils.lerp(leaf2Ref.current.rotation.y, -0.65, delta * 2.5);
      }

      // Golden light intensifies
      if (spotlightRef.current) {
        spotlightRef.current.intensity = THREE.MathUtils.lerp(spotlightRef.current.intensity, 18.0, delta * 3.0);
      }

      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2.2, delta * 2.2);

      if (progress >= 1.0 || state.camera.position.z < 2.5) {
        if (onEntered) {
          onEntered();
        }
      }
    }
  });

  return (
    <group ref={masterGroupRef} scale={isHero ? [1.1, 1.1, 1.1] : [0.85, 0.85, 0.85]}>
      {/* Primary Leaf: Polished Champagne Gold (Curving Sheet) */}
      <mesh
        ref={leaf1Ref}
        geometry={leaf1Geo}
        material={champagneMaterial}
        position={[0.15, 0, 0.08]}
        rotation={[0.08, 0.18, -0.04]}
        castShadow
        receiveShadow
      />

      {/* Counter Leaf: Antique Gold (Layered Behind with Counter-Curve) */}
      <mesh
        ref={leaf2Ref}
        geometry={leaf2Geo}
        material={antiqueMaterial}
        position={[-0.22, -0.05, -0.1]}
        rotation={[-0.06, -0.38, 0.06]}
        castShadow
        receiveShadow
      />

      {/* Axis Spine & Jewel: Anchoring Equilibrium */}
      <group ref={spineRef} position={[-0.04, 0, 0]}>
        <mesh geometry={spineGeo} material={champagneMaterial} />
        <mesh geometry={jewelGeo} material={champagneMaterial} position={[0, 0, 0.03]} />
      </group>

      {/* Central Soft Warm Light Nestled Between Sheets */}
      <pointLight
        ref={spotlightRef}
        position={[0, 0.1, 0.15]}
        intensity={2.8}
        distance={5}
        color="#F5EFE3"
        decay={2}
      />
    </group>
  );
}

// ---------------------------------------------------------------------
// Exported Component: Seamless Transparent Canvas with Studio Lighting
// ---------------------------------------------------------------------
export const GoldenLedger: React.FC<GoldenLedgerProps> = ({
  isEntering = false,
  onEntered,
  size = 'hero',
}) => {
  const containerClasses = {
    hero: 'w-full h-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[640px]',
    compact: 'w-[260px] h-[260px]',
    nav: 'w-[36px] h-[36px]',
  }[size];

  return (
    <div className={`relative ${containerClasses} select-none overflow-visible flex items-center justify-center`}>
      {/* Soft Ambient Champagne Downlight (No hard edges, no black box) */}
      {size === 'hero' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] rounded-full bg-[radial-gradient(circle,rgba(214,183,122,0.22)_0%,rgba(167,123,54,0.08)_45%,transparent_70%)] blur-3xl transform -translate-y-2" />
        </div>
      )}

      <Canvas
        camera={{
          position: [0, 0, size === 'nav' ? 3.4 : 4.6],
          fov: 36,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Gallery Studio Illumination Setup */}
        <ambientLight intensity={1.3} color="#F5EFE3" />

        {/* Studio Key Light: Warm Ivory Light from Upper Right */}
        <directionalLight
          position={[6, 8, 5]}
          intensity={3.2}
          color="#FFF9EE"
          castShadow
        />

        {/* Soft Champagne Rim Light from behind/left for metallic silhouette */}
        <directionalLight
          position={[-6, 4, -4]}
          intensity={2.6}
          color="#D6B77A"
        />

        {/* Warm Ground Fill: Antique Gold soft bounce */}
        <directionalLight
          position={[0, -4, 3]}
          intensity={1.6}
          color="#A77B36"
        />

        {/* Top Specular Accent Pin-Light */}
        <pointLight
          position={[1, 3.5, 2]}
          intensity={1.8}
          color="#F5EFE3"
        />

        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.25}>
          <LedgerSculptureSubject
            isEntering={isEntering}
            onEntered={onEntered}
            isHero={size === 'hero'}
          />
        </Float>
      </Canvas>
    </div>
  );
};
