// Adapted from "Noise animation - Electric" by nimitz (stormoid.com, @stormoid).
// https://www.shadertoy.com/view/ldlXRS
// CC BY-NC-SA 3.0 - https://creativecommons.org/licenses/by-nc-sa/3.0/
// Minerva: procedural noise replaces iChannel0; bounded toroidal field settles on ignition.
float electricHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float electricNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(electricHash(cell), electricHash(cell + vec2(1.0, 0.0)), f.x),
    mix(electricHash(cell + vec2(0.0, 1.0)), electricHash(cell + 1.0), f.x), f.y);
}
mat2 electricRotation(float theta) { float c = cos(theta), s = sin(theta); return mat2(c, -s, s, c); }
float electricFbm(vec2 p) {
  float z = 2.0, result = 0.0;
  for (int i = 0; i < 5; i++) {
    result += abs((electricNoise(p) - 0.5) * 2.0) / z;
    z *= 2.0;
    p *= 2.0;
  }
  return result;
}
float electricDualFbm(vec2 p, float time) {
  vec2 basis = vec2(electricFbm(p * 0.7 - time * 1.6), electricFbm(p * 0.7 + time * 1.7));
  p += (basis - 0.5) * 0.2;
  return electricFbm(p * electricRotation(time * 0.2));
}
float electricCircle(vec2 p) {
  float r = log(sqrt(max(length(p), 0.001)));
  return abs(mod(r * 4.0, TAU) - 3.14) * 3.0 + 0.2;
}
vec3 reactorField(vec2 p, float progress) {
  float r = length(p);
  if (r > 1.06) return vec3(0.0);
  float time = progress * 2.4;
  float unstable = 1.0 - smoothstep(0.55, 0.88, progress);
  float field = electricDualFbm(p * 3.0, time);
  float radius = 0.57 + (sin(time * 3.8) * 0.045 + (field - 0.3) * 0.28) * unstable;
  float distance = abs(r - radius);
  float rings = pow(abs(0.1 - electricCircle(p / exp(time * 0.3))), 0.9);
  float electric = min(1.6, 0.18 / max(field * rings, 0.025));
  vec3 tint = mix(AMBER, MINT, smoothstep(0.65, 0.92, progress));
  vec3 color = tint * (exp(-distance * 17.0) * (0.35 + electric * unstable) + exp(-distance * 115.0));
  color += vec3(1.0, 0.94, 0.68) * exp(-distance * 220.0) * 0.55;
  float angle = atan(p.y, p.x);
  float hexagon = cos(mod(angle + PI / 6.0, TAU / 6.0) - PI / 6.0) * r;
  color += AMBER * exp(-abs(hexagon - 0.82) * 170.0) * 0.75;
  float sectors = step(0.15, fract((angle / TAU + progress * 0.2) * 12.0));
  color += tint * exp(-abs(r - 0.72) * 120.0) * sectors * 0.65;
  color += tint * exp(-abs(r - 0.37) * 70.0) * 0.18;
  return color * smoothstep(0.0, 0.07, progress) * (1.0 - smoothstep(0.92, 1.0, progress));
}
