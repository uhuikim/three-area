'use client';
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './style.css';
import Experience from '@/components/Experience';
import TextField from '@/components/DimensionInput';
//https://gero3.github.io/facetype.js/

function Page() {

  const [dimensions, setDimensions] = useState({
    width: 5,
    height: 5,
    depth: 5
  });

  // 수치 입력 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };



  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div className="bg-gray-100 p-4 flex flex-wrap gap-4 border-b">
        <TextField
          label="너비 (X)"
          name="width"
          value={dimensions.width}
          onChange={handleChange}
          type="number"
        />
        <TextField
          label="높이 (Y)"
          type="number"
          name="height"
          value={dimensions.height}
          onChange={handleChange}
        />
        <TextField
          label="깊이 (Z)"
          name="depth"
          value={dimensions.depth}
          onChange={handleChange}
          type="number"
        />

        <div className="flex items-end">
          <p className="text-sm text-gray-600">
            현재 공간: {dimensions.width} x {dimensions.height} x {dimensions.depth} 단위
          </p>
        </div>
      </div>
      <Canvas
        camera={{
          fov: 60,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
        flat
      >
        <Experience width={dimensions.width} height={dimensions.height} depth={dimensions.depth} />
      </Canvas>
    </div>
  );
}

export default Page;
