import React from 'react';
import { Canvas } from '@react-three/fiber';
import WaterSphere from './WaterSphere';

function WaterSphereScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <WaterSphere />
    </Canvas>
  );
}

export default WaterSphereScene;