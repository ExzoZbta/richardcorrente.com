uniform sampler2D envMap;
uniform vec2 resolution;
uniform float ior;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

// Fresnel equation
float Fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 eyeVector = normalize(vEyeVector);
  
  // Calculate refraction
  vec3 refracted = refract(eyeVector, normal, 1.0 / ior);
  
  // Get screen coordinates
  vec2 uv = gl_FragCoord.xy / resolution;
  
  // Apply refraction to UV coordinates
  vec2 refractedUV = uv + refracted.xy * 0.15;
  
  // Default to white background if envMap is not available
  vec3 bgColor = vec3(0.737, 0.741, 0.725);
  
  // Try to sample envMap if available, otherwise use white
  vec3 envColor = bgColor;
  //   if (envMap != null) {
  //     vec4 sampled = texture2D(envMap, refractedUV);
  //     envColor = sampled.rgb;
  //   }
  
  // Calculate Fresnel for reflections
  float fresnel = Fresnel(eyeVector, normal);
  
  // Mix refraction with white reflections
  vec3 reflectionColor = vec3(1.0, 1.0, 1.0);
  vec3 finalColor = mix(envColor, reflectionColor, fresnel * 0.4);
  
  // Add subtle water/glass tint
  vec3 waterTint = vec3(0.4, 0.6, 0.85);
  finalColor = mix(finalColor, waterTint, 0.1);
  
  // Calculate alpha - more transparent in center, more opaque at edges
  float alpha = 0.4 + fresnel * 0.5;
  
  gl_FragColor = vec4(finalColor, alpha);
}