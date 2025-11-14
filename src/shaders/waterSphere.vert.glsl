varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;
varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  
  // Calculate world normal
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  
  // Calculate eye vector (from camera to vertex)
  vEyeVector = normalize(worldPosition.xyz - cameraPosition);
  
  // Create rippling effect with noise
  vec3 pos = position;
  float noise = sin(pos.x * 2.0 + time) * sin(pos.y * 3.0 + time * 1.5) * sin(pos.z * 2.5 + time * 0.8);
  noise += sin(pos.x * 4.0 + time * 1.2) * sin(pos.y * 5.0 + time * 2.0) * sin(pos.z * 3.5 + time * 1.5) * 0.5;
  pos += normal * noise * 0.05;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}