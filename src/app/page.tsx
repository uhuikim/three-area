'use client';
import './style.css';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from '@/components/Experience';
import TextField from '@/components/DimensionInput';
import useGetUserLayouts from '@/model/useGetUserLayouts';
import useGetLayoutById from '@/model/useGetLayoutById';

function Page() {
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 5, height: 5, depth: 5 });

  const { layouts, isLoading: isLayoutsLoading } = useGetUserLayouts();
  const { layout, isLoading: isLayoutLoading } = useGetLayoutById(selectedLayoutId);

  // 1. 레이아웃 목록 불러오면 첫 번째 항목 선택
  useEffect(() => {
    if (!selectedLayoutId && layouts.length > 0) {
      setSelectedLayoutId(layouts[0].id);
    }
  }, [layouts, selectedLayoutId]);

  // 2. 레이아웃 변경 시 크기 설정
  useEffect(() => {
    if (layout?.roomDimensions) {
      setDimensions(layout.roomDimensions);
    }
  }, [layout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLayoutId(e.target.value);
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">저장된 레이아웃</label>
          {isLayoutsLoading ? (
            <p className="text-gray-500 text-sm">레이아웃을 불러오는 중...</p>
          ) : (
            <select
              className="border rounded px-2 py-1"
              value={selectedLayoutId || ''}
              onChange={handleLayoutChange}
              disabled={isLayoutsLoading}
            >
              <option value="">레이아웃 선택</option>
              {layouts.map(layout => (
                <option key={layout.id} value={layout.id}>
                  {layout.name} ({new Date(layout.timestamp).toLocaleString()})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <TextField
            label="너비 (X)"
            name="width"
            value={dimensions.width}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="높이 (Y)"
            name="height"
            value={dimensions.height}
            onChange={handleChange}
            type="number"
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
        {isLayoutLoading ? null : (
          <Experience
            dimensions={dimensions}
            layout={layout}
          />
        )}
      </Canvas>
    </div>
  );
}

export default Page;