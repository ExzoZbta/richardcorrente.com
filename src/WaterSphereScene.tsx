import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import WaterSphere from './WaterSphere';

function BackgroundCapture({ onRenderTargetReady }: { onRenderTargetReady: (rt: THREE.WebGLRenderTarget) => void }) {
  const { gl, scene, camera, size } = useThree();
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);

  useEffect(() => {
    const rt = new THREE.WebGLRenderTarget(size.width, size.height);
    rt.texture.format = THREE.RGBAFormat;
    renderTargetRef.current = rt;
    onRenderTargetReady(rt);
    
    return () => {
      rt.dispose();
    };
  }, [size.width, size.height, onRenderTargetReady]);

  useFrame(() => {
    const renderTarget = renderTargetRef.current;
    if (!renderTarget) return;

    const previousRenderTarget = gl.getRenderTarget();
    const previousAutoClear = gl.autoClear;
    const previousMask = camera.layers.mask;

    gl.autoClear = true;
    camera.layers.set(0);

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);

    gl.setRenderTarget(previousRenderTarget);
    gl.autoClear = previousAutoClear;
    camera.layers.mask = previousMask;
  });

  return null;
}

function WaterSphereScene() {
  const envMapRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const lightPosition = useMemo(() => new THREE.Vector3(5, 5, 5), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <BackgroundCapture onRenderTargetReady={(rt) => { envMapRef.current = rt; }} />
      <WaterSphere envMap={envMapRef.current} lightPosition={lightPosition} />
    </Canvas>
  );
}

export default WaterSphereScene;