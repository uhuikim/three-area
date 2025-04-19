import React, { useEffect, useRef } from 'react';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  width: number;
  height: number;
  depth: number;
}

const Experience = ({ width, height, depth }: ExperienceProps) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  // 박스 크기가 변경될 때마다 모서리도 업데이트
  useEffect(() => {
    if (boxRef.current && edgesRef.current) {
      // 박스의 모서리 계산
      const edges = new THREE.EdgesGeometry(boxRef.current.geometry);
      edgesRef.current.geometry.dispose();
      edgesRef.current.geometry = edges;
    }
  }, [width, height, depth]);

  return (
    <>
      <OrbitControls />
      <Box ref={boxRef} args={[width, height, depth]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#2080ff"
          transparent={true}
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Box>

      {/* 방의 모서리 (테두리) */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#0040a0" linewidth={2} />
      </lineSegments>

      {/* 방 내부에 가구나 소품 추가 (예시) */}
      {/* 침대 */}
      <mesh position={[-width / 3, -height / 2 + 0.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width / 2, 0.6, depth / 1.5]} />
        <meshStandardMaterial color="#6a4c93" />
      </mesh>

      {/* 책상 */}
      <mesh position={[width / 3, -height / 2 + 0.8, depth / 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width / 3, 0.1, depth / 3]} />
        <meshStandardMaterial color="#8a5a44" />
      </mesh>

      {/* 책상 다리 */}
      <mesh position={[width / 3, -height / 2 + 0.4, depth / 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width / 3 - 0.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#8a5a44" />
      </mesh>

      {/* 기본 조명 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-width / 2, height / 2, -depth / 2]} intensity={0.5} color="#ff9900" />
    </>
  );
};

export default Experience;