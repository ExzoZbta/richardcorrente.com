import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

function WaterSphere() {
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef(0);

  // Create shader material for water effect
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uRefractionRatio: { value: 0.98 },
        uFresnelBias: { value: 0.1 },
        uFresnelScale: { value: 1.0 },
        uFresnelPower: { value: 2.0 },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          // Create rippling effect with noise
          vec3 pos = position;
          float noise = sin(pos.x * 2.0 + time) * sin(pos.y * 3.0 + time * 1.5) * sin(pos.z * 2.5 + time * 0.8);
          noise += sin(pos.x * 4.0 + time * 1.2) * sin(pos.y * 5.0 + time * 2.0) * sin(pos.z * 3.5 + time * 1.5) * 0.5;
          pos += normal * noise * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uRefractionRatio;
        uniform float uFresnelBias;
        uniform float uFresnelScale;
        uniform float uFresnelPower;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - dot(viewDirection, vNormal), uFresnelPower);
          
          // Water-like color with transparency
          vec3 waterColor = vec3(0.5, 0.7, 0.9);
          float alpha = 0.3 + fresnel * 0.4;
          
          gl_FragColor = vec4(waterColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animate the rippling
  useFrame((state, delta) => {
    if (meshRef.current && material) {
      timeRef.current += delta;
      material.uniforms.time.value = timeRef.current;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.0, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default WaterSphere;