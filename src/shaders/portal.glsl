// Adapted from "BlackHole (swirl, portal)" by misterprada, CC BY-NC-SA 3.0.
// https://www.shadertoy.com/view/lcfyDj
// Visual reference: celestianmaze, https://x.com/cmzw_/status/1787147460772864188
// Minerva: bounded centre, fixed five noise octaves, transparent rim compositing.
vec4 permute_3d(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt3d(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float simplexNoise3d(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute_3d(permute_3d(permute_3d(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt3d(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m *= m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3d(vec3 x) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; ++i) {
    v += a * simplexNoise3d(x);
    x = x * 2.0 + vec3(100.0);
    a *= 0.5;
  }
  return v;
}

vec3 portalSwirl(vec2 uv, float time, out float fieldDistance) {
  vec3 color = normalize(vec3(uv, 0.5));
  color.z -= 0.2 * time;
  float angle = -log2(max(length(uv), 0.001));
  float c = cos(angle);
  float s = sin(angle);
  color.xy = mat2(c, s, -s, c) * color.xy;
  color.x = fbm3d(color * 1.4) + 0.01;
  color.y = fbm3d(color * 1.4 + 1.0) + 0.01;
  color.z = fbm3d(color * 1.4 + 2.0) + 0.01;
  vec3 noiseColor = (color * 2.0 - 0.1) * 0.188 + vec3(uv, 0.0);
  fieldDistance = length(noiseColor);
  float strength = (0.770 - fieldDistance) * 4.2;
  vec3 emissionColor = vec3(0.961, 0.592, 0.078) * strength * 0.4;
  vec3 direction = normalize(color + 0.32);
  float fac = (length(uv) - max(max(direction.x, direction.y), direction.z) + 0.1) * 3.0;
  return max(vec3(0.0), mix(emissionColor, vec3(fac), fac + 1.2));
}
