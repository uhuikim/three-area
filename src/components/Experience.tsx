import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls, Box, DragControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExperienceProps {
  width: number;
  height: number;
  depth: number;
}

const Experience = ({ width, height, depth }: ExperienceProps) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const bedRef = useRef<THREE.Mesh>(null);
  const deskRef = useRef<THREE.Mesh>(null);
  const orbitControlsRef = useRef(null);

  const [isColliding, setIsColliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { gl } = useThree();

  useEffect(() => {
    if (boxRef.current && edgesRef.current) {
      const edges = new THREE.EdgesGeometry(boxRef.current.geometry);
      edgesRef.current.geometry.dispose();
      edgesRef.current.geometry = edges;
    }
  }, [width, height, depth]);

  const checkCollision = () => {
    if (!bedRef.current || !deskRef.current) return false;
    const bedBounds = new THREE.Box3().setFromObject(bedRef.current);
    const deskBounds = new THREE.Box3().setFromObject(deskRef.current);
    return bedBounds.intersectsBox(deskBounds);
  };

  useFrame(() => {
    const isCurrentlyColliding = checkCollision();
    if (isCurrentlyColliding !== isColliding) {
      setIsColliding(isCurrentlyColliding);
    }
  });

  return (
    <>
      {/* OrbitControls에 ref와 enabled 속성 추가 */}
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        enabled={!isDragging} // 드래그 중일 때는 OrbitControls 비활성화
      />

      <Box ref={boxRef} args={[width, height, depth]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#111111"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Box>

      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#0040a0" linewidth={2} />
      </lineSegments>

      {/* 침대 - DragControls 이벤트 수정 */}
      <DragControls
        onDragStart={() => {
          gl.domElement.style.cursor = 'grabbing';
          setIsDragging(true); // 드래그 상태 활성화
        }}
        onDrag={() => {
          // 드래그 중에 필요한 로직
        }}
        onDragEnd={() => {
          gl.domElement.style.cursor = 'auto';
          setIsDragging(false); // 드래그 상태 비활성화
        }}
      >
        <mesh
          ref={bedRef}
          position={[-width / 3, -height / 2 + 0.3, 0]}
        >
          <boxGeometry args={[width / 2, 0.6, depth / 1.5]} />
          <meshStandardMaterial color={"#6a4c93"} />
        </mesh>
      </DragControls>

      {/* 책상 - DragControls 이벤트 수정 */}
      <DragControls
        onDragStart={() => {
          gl.domElement.style.cursor = 'grabbing';
          setIsDragging(true); // 드래그 상태 활성화
        }}
        onDrag={() => {
          // 드래그 중에 필요한 로직
        }}
        onDragEnd={() => {
          gl.domElement.style.cursor = 'auto';
          setIsDragging(false); // 드래그 상태 비활성화
        }}
      >
        <mesh
          ref={deskRef}
          position={[width / 3, -height / 2 + 0.8, depth / 3]}
        >
          <boxGeometry args={[width / 3, 0.1, depth / 3]} />
          <meshStandardMaterial color={"#8a5a44"} />
        </mesh>
      </DragControls>

      {/* 기본 조명 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* 충돌 감지에 따른 조명 변경 */}
      <directionalLight
        position={[0, height / 2, 0]}
        color={isColliding ? '#ff0000' : '#ffffff'}
        intensity={isColliding ? 1.5 : 1.0}
      />

      {/* 시각적 전등 구체 */}
      <mesh position={[0, height / 2 - 0.2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={isColliding ? "#ff0000" : "#ffffff"}
          emissive={isColliding ? "#ff0000" : "#ffffff"}
          emissiveIntensity={1}
        />
      </mesh>
    </>
  );
};

export default Experience;