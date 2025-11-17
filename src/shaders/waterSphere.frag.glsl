precision highp float;

uniform sampler2D envMap;
uniform float hasEnvMap;
uniform vec2 resolution;
uniform float ior;
uniform vec3 lightPosition;
uniform vec3 tintColor;
uniform float tintIntensity;
uniform float refractionStrength;
uniform float reflectionStrength;
uniform float opacity;
uniform float fresnelPower;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec4 vClipPosition;
varying float vRippleAmount;

vec3 fallbackBackground(vec2 uv) {
  vec3 top = vec3(0.12, 0.16, 0.22);
  vec3 bottom = vec3(0.02, 0.03, 0.05);
  return mix(bottom, top, clamp(uv.y, 0.0, 1.0));
}

vec3 sampleEnv(vec2 uv) {
  vec2 safeUv = clamp(uv, vec2(0.001), vec2(0.999));
  if (hasEnvMap < 0.5) {
    return fallbackBackground(safeUv);
  }
  return texture2D(envMap, safeUv).rgb;
}

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(vViewDir);
  vec3 incident = normalize(-viewDir);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);

  float ndotl = max(dot(normal, lightDir), 0.0);
  vec3 halfVector = normalize(lightDir + viewDir);
  float specPower = mix(32.0, 96.0, clamp(vRippleAmount * 3.0 + 0.5, 0.0, 1.0));
  float specular = pow(max(dot(normal, halfVector), 0.0), specPower);

  vec4 clip = vClipPosition / vClipPosition.w;
  vec2 screenUV = clip.xy * 0.5 + 0.5;

  float aspect = resolution.y > 0.0 ? resolution.x / resolution.y : 1.0;
  vec2 refractedOffset = refract(incident, normal, 1.0 / ior).xy;
  refractedOffset.x *= aspect;
  vec2 reflectedOffset = reflect(incident, normal).xy;
  reflectedOffset.x *= aspect;

  vec2 refractionUV = screenUV + refractedOffset * refractionStrength;
  vec2 reflectionUV = screenUV + reflectedOffset * reflectionStrength;

  vec3 refractedColor = sampleEnv(refractionUV);
  vec3 reflectedColor = sampleEnv(reflectionUV);

  vec3 tintedRefraction = mix(refractedColor, refractedColor * tintColor, 0.5);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), fresnelPower);
  vec3 combinedEnv = mix(tintedRefraction, reflectedColor, clamp(fresnel + 0.1, 0.0, 1.0));

  float distanceFalloff = 1.0 / (1.0 + 0.08 * length(lightPosition - vWorldPosition));
  vec3 diffuse = tintColor * (0.2 + 0.8 * ndotl) * distanceFalloff;
  vec3 lighting = diffuse + specular * vec3(0.9);

  vec3 finalColor = combinedEnv + lighting * 0.6;
  float finalAlpha = clamp(opacity * (0.4 + fresnel * 0.6), 0.0, 1.0);

  // Bias the final color
  vec3 colorized = mix(finalColor, tintColor, clamp(tintIntensity, 0.0, 1.0));
  gl_FragColor = vec4(colorized, finalAlpha);
}

