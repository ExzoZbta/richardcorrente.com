precision highp float;

uniform sampler2D envMap;
uniform float hasEnvMap;
uniform sampler2D hdrEnvMap;
uniform float hasHdrEnvMap;
uniform vec2 resolution;
uniform float ior;
uniform vec3 lightPosition;
uniform vec3 tintColor;
uniform float tintIntensity;
uniform vec3 surfaceColor;
uniform vec3 deepColor;
uniform vec3 rimColor;
uniform float rimIntensity;
uniform float surfaceMix;
uniform float absorptionStrength;
uniform float refractionStrength;
uniform float reflectionStrength;
uniform float opacity;
uniform float fresnelPower;
uniform float iblMix;
uniform float hdrIntensity;
uniform float hdrViewFade;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec4 vClipPosition;
varying float vRippleAmount;

const float PI = 3.141592653589793;

vec3 sampleHdrEnv(vec3 dir);

vec3 fallbackBackground(vec2 uv) {
  vec3 top = vec3(0.12, 0.16, 0.22);
  vec3 bottom = vec3(0.02, 0.03, 0.05);
  return mix(bottom, top, clamp(uv.y, 0.0, 1.0));
}

vec3 sampleEnv(vec2 uv, vec3 reflectionDir) {
  if (hasEnvMap < 0.5) {
    vec2 safeUv = clamp(uv, vec2(0.001), vec2(0.999));
    return fallbackBackground(safeUv);
  }

  bool outOfBounds = uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0;
  if (outOfBounds) {
    return sampleHdrEnv(reflectionDir);
  }

  vec2 safeUv = clamp(uv, vec2(0.001), vec2(0.999));
  return texture2D(envMap, safeUv).rgb;
}

vec2 directionToEquirectUV(vec3 dir) {
  vec3 n = normalize(dir);
  float phi = atan(n.z, n.x);
  float theta = asin(clamp(n.y, -1.0, 1.0));
  return vec2(0.5 + phi / (2.0 * PI), 0.5 - theta / PI);
}

vec3 sampleHdrEnv(vec3 dir) {
  vec2 uv = directionToEquirectUV(dir);
  vec3 fallback = vec3(0.05, 0.08, 0.1);
  vec3 sampled = texture2D(hdrEnvMap, uv).rgb;
  return mix(fallback, sampled, hasHdrEnvMap);
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
  vec3 reflectionDir = reflect(-viewDir, normal);
  vec2 reflectedOffset = reflectionDir.xy;
  reflectedOffset.x *= aspect;

  vec2 refractionUV = screenUV + refractedOffset * refractionStrength;
  vec2 reflectionUV = screenUV + reflectedOffset * reflectionStrength;

  vec3 refractedColor = sampleEnv(refractionUV, reflectionDir);
  vec3 screenReflection = sampleEnv(reflectionUV, reflectionDir);
  vec3 hdrReflection = sampleHdrEnv(reflectionDir) * hdrIntensity;

  vec3 tintedRefraction = mix(refractedColor, tintColor, 0.5);
  float cosTheta = clamp(abs(dot(normal, viewDir)), 0.0, 1.0);
  float viewAlignment = cosTheta;
  float hdrContribution = clamp(iblMix * pow(1.0 - viewAlignment, hdrViewFade), 0.0, 1.0);
  vec3 reflectionColor = mix(screenReflection, hdrReflection, hdrContribution);
  float fresnel = pow(1.0 - cosTheta, fresnelPower);
  vec3 combinedEnv = mix(tintedRefraction, reflectionColor, clamp(fresnel + 0.05, 0.0, 1.0));
  float depthFactor = pow(1.0 - viewAlignment, 1.3);
  vec3 volumeColor = mix(surfaceColor, deepColor, depthFactor);
  float absorption = exp(-absorptionStrength * depthFactor * 1.5);
  vec3 absorbedEnv = combinedEnv * absorption;

  float distanceFalloff = 1.0 / (1.0 + 0.08 * length(lightPosition - vWorldPosition));
  vec3 diffuse = tintColor * (0.2 + 0.8 * ndotl) * distanceFalloff;
  vec3 lighting = diffuse + specular * vec3(0.9);

  float rim = pow(1.0 - viewAlignment, 2.2);
  vec3 rimContribution = rimColor * rim * rimIntensity;

  vec3 depthCombined = mix(absorbedEnv, volumeColor, clamp(surfaceMix, 0.0, 1.0));
  vec3 finalColor = depthCombined + lighting * 0.6 + rimContribution;
  vec3 colorized = mix(finalColor, tintColor, clamp(tintIntensity, 0.0, 1.0));

  float finalAlpha = clamp(opacity * (0.4 + fresnel * 0.6), 0.0, 1.0);
  gl_FragColor = vec4(colorized, finalAlpha);
}

