import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { formatINR, CATEGORY_COLORS } from '../../utils/formatters';
import { CategoryBreakdownItem } from '../../types';

interface ExpensePieChart3DProps {
  data: CategoryBreakdownItem[];
  totalSpent: number;
  onSelectCategory?: (category: string | null) => void;
  selectedCategory?: string | null;
}

interface SegmentProps {
  category: string;
  amount: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  depth: number;
  color: string;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

const DonutSegment: React.FC<SegmentProps> = ({
  category,
  amount,
  percentage,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  depth,
  color,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const midAngle = (startAngle + endAngle) / 2;

  // Generate 2D extruded arc shape
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Outer arc
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    // Inner arc
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 40,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [startAngle, endAngle, innerRadius, outerRadius, depth]);

  const targetZ = isHovered || isSelected ? 0.3 : 0;
  const targetOffset = isHovered || isSelected ? 0.24 : 0;
  const targetX = Math.cos(midAngle) * targetOffset;
  const targetY = Math.sin(midAngle) * targetOffset;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 12);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 12);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 12);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.88}
        roughness={0.2}
        emissive={isHovered || isSelected ? color : '#191713'}
        emissiveIntensity={isHovered || isSelected ? 0.45 : 0.08}
      />
    </mesh>
  );
};

export const ExpensePieChart3D: React.FC<ExpensePieChart3DProps> = ({
  data,
  totalSpent,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter items with amount > 0
  const activeSegments = useMemo(() => {
    return data.filter((item) => item.amount > 0);
  }, [data]);

  // Compute angles for each segment
  const segmentsWithAngles = useMemo(() => {
    if (totalSpent <= 0 || activeSegments.length === 0) return [];

    let currentAngle = 0;
    return activeSegments.map((item) => {
      const angleFraction = (item.amount / totalSpent) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleFraction;
      currentAngle = endAngle;

      return {
        ...item,
        startAngle,
        endAngle,
        color: CATEGORY_COLORS[item.category]?.hex || '#D6B77A',
      };
    });
  }, [activeSegments, totalSpent]);

  const activeHoverOrSelected = hoveredCategory || selectedCategory;
  const activeItem = data.find((d) => d.category === activeHoverOrSelected);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center select-none">
      {/* Warm Golden Glow behind donut */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(229,169,75,0.12)_0%,rgba(214,183,122,0.03)_50%,transparent_70%)] blur-2xl" />
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 7, 6]} intensity={2.2} color="#F5C26B" />
        <directionalLight position={[-5, -4, 3]} intensity={1.1} color="#D6B77A" />
        <pointLight position={[0, 0, 3]} intensity={1.0} color="#E5A94B" />

        <group rotation={[-Math.PI / 6, 0, 0]}>
          {segmentsWithAngles.length > 0 ? (
            segmentsWithAngles.map((seg) => (
              <DonutSegment
                key={seg.category}
                category={seg.category}
                amount={seg.amount}
                percentage={seg.percentage}
                startAngle={seg.startAngle}
                endAngle={seg.endAngle}
                innerRadius={0.95}
                outerRadius={1.7}
                depth={0.32}
                color={seg.color}
                isHovered={hoveredCategory === seg.category}
                isSelected={selectedCategory === seg.category}
                onHover={(h) => setHoveredCategory(h ? seg.category : null)}
                onSelect={() => {
                  const next = selectedCategory === seg.category ? null : seg.category;
                  onSelectCategory?.(next);
                }}
              />
            ))
          ) : (
            // Sculptural Empty State Donut Ring in Brushed Bronze
            <mesh>
              <torusGeometry args={[1.3, 0.26, 28, 80]} />
              <meshStandardMaterial
                color="#282016"
                metalness={0.92}
                roughness={0.25}
                wireframe={false}
              />
            </mesh>
          )}

          {/* Center HTML Typography Label */}
          <Html center distanceFactor={4.5} className="pointer-events-none">
            <div className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-champagne/25 min-w-[130px] shadow-2xl">
              <span className="font-mono text-[9px] uppercase tracking-widest text-typography-muted">
                {activeItem ? activeItem.category : 'Total Spent'}
              </span>
              <span className="font-sans font-extrabold text-lg text-ivory tracking-tight mt-0.5">
                {formatINR(activeItem ? activeItem.amount : totalSpent)}
              </span>
              {activeItem && totalSpent > 0 && (
                <span className="font-mono text-[10px] text-champagne font-semibold mt-0.5">
                  {((activeItem.amount / totalSpent) * 100).toFixed(1)}% of total
                </span>
              )}
            </div>
          </Html>
        </group>
      </Canvas>

      {/* Interactive Tooltip Hover Card Overlay */}
      {hoveredCategory && activeItem && (
        <div className="absolute top-4 right-4 pointer-events-none p-3.5 rounded-xl bg-surface-elevated/95 border border-champagne/30 shadow-golden-glow flex items-center gap-3 animate-fadeIn text-left">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[hoveredCategory]?.hex || '#D6B77A' }}
          />
          <div>
            <div className="text-xs font-semibold text-ivory">{hoveredCategory}</div>
            <div className="text-sm font-mono font-bold text-champagne">{formatINR(activeItem.amount)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
