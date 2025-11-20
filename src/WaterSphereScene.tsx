import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import WaterSphere from './WaterSphere';
import hdrPath from './assets/hdr/qwantani_puresky_1k.hdr';

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
  const [hdrEnvMap, setHdrEnvMap] = useState<THREE.Texture | null>(null);
  const sphereRadius = 2.0; // 1.5 original size
  const sphereSegments = 160; // 160 original segments

  useEffect(() => {
    let disposed = false;
    const loader = new RGBELoader();
    loader.setDataType(THREE.FloatType);
    loader.setCrossOrigin('anonymous');
    loader.load(
      hdrPath,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        setHdrEnvMap(texture);
      },
      undefined,
      (error) => {
        console.error('Failed to load HDR environment map', error);
      }
    );

    return () => {
      disposed = true;
      setHdrEnvMap((prev) => {
        prev?.dispose();
        return null;
      });
    };
  }, []);

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
      <WaterSphere
        envMap={envMapRef.current}
        hdrEnvMap={hdrEnvMap}
        lightPosition={lightPosition}
        radius={sphereRadius}
        segments={sphereSegments}
      />
    </Canvas>
  );
}

export default WaterSphereScene;