import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';
import waterSphereVertexShader from './shaders/waterSphere.vert.glsl';
import waterSphereFragmentShader from './shaders/waterSphere.frag.glsl';

interface WaterSphereProps {
  envMap?: THREE.WebGLRenderTarget | null;
  hdrEnvMap?: THREE.Texture | null;
  lightPosition?: THREE.Vector3;
}

function WaterSphere({ envMap, hdrEnvMap, lightPosition }: WaterSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef(0);
  const { size, camera } = useThree();
  const defaultLightPosition = useMemo(() => new THREE.Vector3(5, 5, 5), []);
  const effectiveLightPosition = lightPosition ?? defaultLightPosition;
  const tintColor = useMemo(() => new THREE.Color('rgb(198, 207, 224)'), []);
  const surfaceColor = useMemo(() => new THREE.Color('rgb(14, 78, 239)'), []);
  const deepColor = useMemo(() => new THREE.Color('rgb(10, 13, 80)'), []);
  const rimColor = useMemo(() => new THREE.Color('rgb(235, 230, 230)'), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.layers.set(1);
    camera.layers.enable(1);

    return () => {
      mesh.layers.set(0);
    };
  }, [camera]);

  // Create shader material for glass effect with refraction
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        envMap: { value: null },
        hasEnvMap: { value: 0.0 },
        hdrEnvMap: { value: null },
        hasHdrEnvMap: { value: 0.0 },
        resolution: { value: new THREE.Vector2(size.width, size.height) },
        ior: { value: 1.33 }, // Index of refraction for water
        lightPosition: { value: effectiveLightPosition.clone() },
        tintColor: { value: tintColor.clone() },
        tintIntensity: { value: .65},
        surfaceColor: { value: surfaceColor.clone() },
        // deepColor: { value: deepColor.clone() },
        rimColor: { value: rimColor.clone() },
        rimIntensity: { value: 0.55 },
        surfaceMix: { value: 0.55 },
        absorptionStrength: { value: 1.2 },
        refractionStrength: { value: 0.2 },
        reflectionStrength: { value: 0.06 },
        iblMix: { value: 0.65 },
        hdrIntensity: { value: 20.0 },
        opacity: { value: 0.6 },
        fresnelPower: { value: 3.0 },
        distortionAmplitude: { value: 0.3 },
        noiseScale: { value: 0.5 },
        rippleSpeed: { value: 0.22 },
      },
      vertexShader: waterSphereVertexShader,
      fragmentShader: waterSphereFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [size.width, size.height, effectiveLightPosition, tintColor, surfaceColor, deepColor, rimColor]);

  // Update uniforms
  useFrame((state, delta) => {
    if (meshRef.current && material) {
      timeRef.current += delta;
      material.uniforms.time.value = timeRef.current;
      
      if (envMap) {
        material.uniforms.envMap.value = envMap.texture;
        material.uniforms.hasEnvMap.value = 1.0;  // Set to 1.0 when envMap is available
      } else {
        material.uniforms.envMap.value = null;
        material.uniforms.hasEnvMap.value = 0.0;  // Set to 0.0 when envMap is not available
      }

      if (hdrEnvMap) {
        material.uniforms.hdrEnvMap.value = hdrEnvMap;
        material.uniforms.hasHdrEnvMap.value = 1.0;
      } else {
        material.uniforms.hdrEnvMap.value = null;
        material.uniforms.hasHdrEnvMap.value = 0.0;
      }
      
      // Update resolution on resize
      material.uniforms.resolution.value.set(size.width, size.height);
      material.uniforms.lightPosition.value.copy(effectiveLightPosition);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default WaterSphere;