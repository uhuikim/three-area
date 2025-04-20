import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls, Box, DragControls, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Layout, RoomDimensions, Furniture } from '@/types/layout';

interface ExperienceProps {
  dimensions: RoomDimensions;
  layout?: Layout | null;
}

interface FurnitureWithRef extends Furniture {
  ref: React.RefObject<THREE.Mesh | null>;
}

const Experience = ({ dimensions, layout }: ExperienceProps) => {
  const { depth, height, width } = dimensions;
  const boxRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const orbitControlsRef = useRef(null);
  const { gl } = useThree();
  const collisionColor = "#ff0000";

  const [isDragging, setIsDragging] = useState(false);
  const [activeDragObject, setActiveDragObject] = useState<string | null>(null);
  const [lastDraggedObject, setLastDraggedObject] = useState<string | null>(null);
  const [furnitureList, setFurnitureList] = useState<FurnitureWithRef[]>([]);

  // layout 변경 시 가구 리스트 초기화
  useEffect(() => {
    if (layout) {
      const newFurnitureList = layout.furnitures.map(f => ({
        ...f,
        ref: React.createRef<THREE.Mesh>(),
      }));
      setFurnitureList(newFurnitureList);
    }
  }, [layout]);

  // 룸 테두리 업데이트
  useEffect(() => {
    if (boxRef.current && edgesRef.current) {
      const edges = new THREE.EdgesGeometry(boxRef.current.geometry);
      edgesRef.current.geometry.dispose();
      edgesRef.current.geometry = edges;
    }
  }, [width, height, depth]);

  // 충돌 감지
  const checkCollisions = () => {
    const newCollidingPairs = new Set<string>();
    let hasCollision = false;

    for (let i = 0; i < furnitureList.length; i++) {
      for (let j = i + 1; j < furnitureList.length; j++) {
        const f1 = furnitureList[i].ref.current;
        const f2 = furnitureList[j].ref.current;

        if (f1 && f2) {
          const b1 = new THREE.Box3().setFromObject(f1);
          const b2 = new THREE.Box3().setFromObject(f2);
          if (b1.intersectsBox(b2)) {
            hasCollision = true;
            newCollidingPairs.add(`${furnitureList[i].id}-${furnitureList[j].id}`);
          }
        }
      }
    }

    return { hasCollision, collidingPairs: newCollidingPairs };
  };

  const isFurnitureColliding = (id: string, pairs: Set<string>) =>
    Array.from(pairs).some(pair => pair.includes(id));

  const updateFurnitureColors = (hasCollision: boolean, pairs: Set<string>) => {
    furnitureList.forEach(f => {
      const mesh = f.ref.current;
      if (mesh) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        const isColliding = hasCollision && isFurnitureColliding(f.id, pairs);
        const shouldHighlight = isColliding &&
          (isDragging && activeDragObject === f.id || !isDragging && lastDraggedObject === f.id);

        material.color.set(shouldHighlight ? collisionColor : f.color);
      }
    });
  };


  useFrame(() => {
    const { hasCollision, collidingPairs } = checkCollisions();
    updateFurnitureColors(hasCollision, collidingPairs);
  });

  const handleDragStart = (id: string) => {
    gl.domElement.style.cursor = 'grabbing';
    setIsDragging(true);
    setActiveDragObject(id);
  };

  const handleDragEnd = (id: string) => {
    gl.domElement.style.cursor = 'auto';
    setIsDragging(false);
    setLastDraggedObject(id);
    setActiveDragObject(null);
  };

  if (!layout) {
    return (
      <Html center>
        <div>Loading...</div>
      </Html>
    );
  }

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      <OrbitControls ref={orbitControlsRef} makeDefault enabled={!isDragging} />

      {/* 룸 */}
      <Box ref={boxRef} args={[width, height, depth]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Box>
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#0040a0" linewidth={2} />
      </lineSegments>

      {/* 가구 */}
      {furnitureList.map((f) => (
        <DragControls
          key={`drag-${f.id}`}
          onDragStart={() => handleDragStart(f.id)}
          onDragEnd={() => handleDragEnd(f.id)}
        >
          <mesh ref={f.ref} position={f.position}>
            {f.type === "cylinder" ? (
              <cylinderGeometry args={[f.size[0] / 2, f.size[0] / 2, f.size[1], 32]} />
            ) : (
              <boxGeometry args={f.size} />
            )}
            <meshStandardMaterial color={f.color} roughness={0.7} metalness={0.1} />
          </mesh>
        </DragControls>
      ))}

      {/* 조명 */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
    </>
  );
};

export default Experience;