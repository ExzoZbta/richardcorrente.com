precision highp float;

uniform float time;
uniform float distortionAmplitude;
uniform float noiseScale;
uniform float rippleSpeed;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec4 vClipPosition;
varying float vRippleAmount;

// Stefan Gustavson's simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 g0 = vec3(a0.xy, h.x);
  vec3 g1 = vec3(a0.zw, h.y);
  vec3 g2 = vec3(a1.xy, h.z);
  vec3 g3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
  g0 *= norm.x;
  g1 *= norm.y;
  g2 *= norm.z;
  g3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3)));
}

float fbm(vec3 x) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(x * frequency);
    frequency *= 2.0;
    amplitude *= 0.45;
  }

  return value;
}

vec3 buildTangent(vec3 normalDir) {
  vec3 tangent = normalize(cross(normalDir, vec3(0.0, 1.0, 0.0)));
  if (length(tangent) < 0.001) {
    tangent = normalize(cross(normalDir, vec3(1.0, 0.0, 0.0)));
  }
  return tangent;
}

void main() {
  vec3 normalDir = normalize(normal);
  vec3 tangent = buildTangent(normalDir);
  vec3 bitangent = normalize(cross(normalDir, tangent));

  vec3 noiseInput = position * noiseScale;
  vec3 timeShift = vec3(time * 0.1, time * rippleSpeed, -time * 0.15);

  float baseNoise = fbm(noiseInput + timeShift);
  float secondaryNoise = fbm(noiseInput * 1.7 - timeShift);
  float displacement = (baseNoise * 0.7 + secondaryNoise * 0.3) * distortionAmplitude;

  vec3 displacedPosition = position + normalDir * displacement;

  float sampleOffset = 0.04;
  float noiseT = fbm((noiseInput + tangent * sampleOffset * noiseScale) + timeShift);
  noiseT = (noiseT * 0.7 + fbm((noiseInput * 1.7 + tangent * sampleOffset * noiseScale) - timeShift) * 0.3) * distortionAmplitude;
  float noiseB = fbm((noiseInput + bitangent * sampleOffset * noiseScale) + timeShift);
  noiseB = (noiseB * 0.7 + fbm((noiseInput * 1.7 + bitangent * sampleOffset * noiseScale) - timeShift) * 0.3) * distortionAmplitude;

  vec3 displacedTangent = tangent + normalDir * ((noiseT - displacement) / sampleOffset);
  vec3 displacedBitangent = bitangent + normalDir * ((noiseB - displacement) / sampleOffset);
  vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

  vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 clipPosition = projectionMatrix * viewPosition;

  gl_Position = clipPosition;

  vWorldPosition = modelPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * displacedNormal);
  vViewDir = cameraPosition - vWorldPosition;
  vClipPosition = clipPosition;
  vRippleAmount = displacement;
}

