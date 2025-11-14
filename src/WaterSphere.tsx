import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';
import waterSphereVertexShader from './shaders/waterSphere.vert.glsl';
import waterSphereFragmentShader from './shaders/waterSphere.frag.glsl';

interface WaterSphereProps {
  envMap?: THREE.WebGLRenderTarget | null;
}

function WaterSphere({ envMap }: WaterSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef(0);
  const { size } = useThree();

  // Create shader material for glass effect with refraction
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        envMap: { value: null },
        resolution: { value: new THREE.Vector2(size.width, size.height) },
        ior: { value: 1.33 }, // Index of refraction for water
      },
      vertexShader: waterSphereVertexShader,
      fragmentShader: waterSphereFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [size.width, size.height]);

  // Update uniforms
  useFrame((state, delta) => {
    if (meshRef.current && material) {
      timeRef.current += delta;
      material.uniforms.time.value = timeRef.current;
      
      if (envMap) {
        material.uniforms.envMap.value = envMap.texture;
      }
      
      // Update resolution on resize
      material.uniforms.resolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default WaterSphere;