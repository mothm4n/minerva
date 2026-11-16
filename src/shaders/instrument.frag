precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_mode;
uniform float u_phase;
uniform vec4 u_signal;
uniform vec4 u_portal;
uniform vec4 u_activity;
uniform float u_visible;
uniform vec4 u_command; // progress, envelope, operation, rejected

// PORTAL_SHADER

const float PI = 3.14159265359;
const float TAU = 6.28318530718;
const vec3 AMBER = vec3(1.0, 0.745, 0.098);
const vec3 MINT = vec3(0.216, 0.973, 0.671);
const vec3 CYAN = vec3(0.220, 0.867, 1.0);
const vec3 MAGENTA = vec3(0.933, 0.396, 1.0);

float ink(float distancePx) {
  float scale = clamp(min(u_resolution.x, u_resolution.y) / 180.0, 0.45, 1.0);
  return 1.0 - smoothstep(0.65 * scale, 1.65 * scale, distancePx);
}
float glow(float distancePx) {
  float scale = clamp(min(u_resolution.x, u_resolution.y) / 180.0, 0.35, 1.0);
  return ink(distancePx) + exp(-distancePx * 0.34 / scale) * 0.62 * scale;
}
// ScanLineJitter + RGBSplit adapted from XanderXu/RealityGlitchArt (MIT).
// The original shader graphs and license are credited in EFECTOS.md.
float commandJitter(vec2 uv) {
  float noise = fract(sin(dot(vec2(floor(uv.y * 48.0), floor(u_command.x * 8.0)), vec2(12.9898, 78.233))) * 43758.547) * 2.0 - 1.0;
  return noise * step(0.65, abs(noise)) * u_command.y * 0.018;
}
float waveDistance(float frequency, float amplitude, float lag) {
  float phase = ((v_uv.x + commandJitter(v_uv)) * frequency - u_phase + lag) * TAU;
  float y = 0.5 + sin(phase) * amplitude * 0.5;
  float slope = cos(phase) * amplitude * 0.5 * frequency * TAU * u_resolution.y / u_resolution.x;
  return abs(v_uv.y - y) * u_resolution.y / sqrt(1.0 + slope * slope);
}
float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 edge = b - a;
  return length(p - a - edge * clamp(dot(p - a, edge) / dot(edge, edge), 0.0, 1.0));
}
// REACTOR_SHADER
void main() {
  vec3 color = vec3(0.0);
  float occlusion = 0.0;
  float motion = u_activity.w;
  if (u_mode > 1.5) {
    vec2 p = (v_uv - 0.5) * u_resolution / min(u_resolution.x, u_resolution.y) * 2.3;
    color = reactorField(p, u_command.x);
  } else if (u_mode < 0.5) {
    float reference = waveDistance(u_signal.z, u_signal.w, 0.0);
    float player = waveDistance(u_signal.x, u_signal.y, 0.0);
    color = CYAN * glow(reference) + MAGENTA * glow(player);
    float split = u_command.y * 0.025;
    color += vec3(1.0, 0.15, 0.12) * glow(waveDistance(u_signal.x, u_signal.y, split)) * u_command.y * 0.5;
    color += CYAN * glow(waveDistance(u_signal.x, u_signal.y, -split)) * u_command.y * 0.5;
    // Fainter previous positions leave the current, measured traces readable.
    for (int i = 1; i <= 3; i++) {
      float lag = float(i) * 0.025;
      float fade = 0.14 / float(i) * motion;
      color += CYAN * exp(-waveDistance(u_signal.z, u_signal.w, lag) * 0.45) * fade;
      color += MAGENTA * exp(-waveDistance(u_signal.x, u_signal.y, lag) * 0.45) * fade;
    }
    float head = fract(u_phase * 0.16);
    float sweep = exp(-abs(v_uv.x - head) * u_resolution.x * 0.09) * motion;
    color += MINT * sweep * 0.055;
    color += vec3(0.65, 1.0, 0.92) * sweep * exp(-min(reference, player) * 0.22) * 0.7;
    float locked = smoothstep(0.94, 0.99, u_activity.y);
    color += MINT * exp(-min(reference, player) * 0.14) * locked * 0.10;
    color *= u_visible;
    vec3 commandColor = mix(MINT, vec3(1.0, 0.23, 0.27), u_command.w);
    float scan = exp(-abs(v_uv.x - u_command.x) * 65.0);
    float brackets = ink(abs(abs(v_uv.x - 0.5) - (0.48 - u_command.x * 0.35)) * u_resolution.x);
    float locking = step(3.5, u_command.z) * (1.0 - step(4.5, u_command.z));
    color += commandColor * mix(scan, brackets, locking) * u_command.y * 1.1;
  } else {
    vec2 p = (v_uv - 0.5) * u_resolution / min(u_resolution.x, u_resolution.y) * 2.0;
    p.x += commandJitter(v_uv);
    float r = length(p);
    float px = min(u_resolution.x, u_resolution.y) * 0.5;
    float angle = atan(p.y, p.x);
    float active = u_activity.x;
    float open = u_portal.x;
    float reveal = smoothstep(0.0, 1.0, u_portal.w);
    float rotation = u_phase * active * (0.035 + open * 0.10);
    vec3 stateColor = mix(MINT, vec3(1.0, 0.23, 0.27), u_portal.z);
    float segments = step(0.13, fract((angle / TAU + rotation) * 12.0));
    float ticks = step(0.78, fract((angle / TAU + 0.5) * 48.0));
    color += MINT * glow(abs(r - 0.95) * px) * 0.7;
    color += MINT * (1.0 - smoothstep(0.010, 0.022, abs(r - 0.90))) * segments;
    color += AMBER * ink(abs(r - 0.975) * px) * ticks * 0.7;
    color += AMBER * glow(abs(r - 0.84) * px) * 0.7;
    float diagnostic = pow(max(0.0, cos(angle + rotation * TAU * 1.5)), 20.0);
    color += CYAN * exp(-abs(r - 0.91) * 45.0) * diagnostic * active * motion * 0.45;
    vec3 frameColor = color;
    color = vec3(0.0);
    for (int i = 0; i < 6; i++) {
      float radius = 0.73 - float(i) * 0.09;
      color += mix(AMBER, MINT, 0.55) * ink(abs(r - radius) * px) * 0.38;
    }
    float turn = angle + u_phase * open * 0.15;
    float sector = mod(turn + PI / 3.0, TAU / 3.0) - PI / 3.0;
    vec2 arm = vec2(cos(sector), sin(sector)) * r;
    for (int i = 0; i < 3; i++) {
      float inset = float(i) * 0.025;
      float width = 0.105 - inset;
      float skew = width * 0.52;
      vec2 a = vec2(0.12 + inset - skew, width);
      vec2 b = vec2(0.62 - inset + skew, width);
      vec2 c = vec2(0.62 - inset - skew, -width);
      vec2 d = vec2(0.12 + inset + skew, -width);
      float edge = min(min(segmentDistance(arm, a, b), segmentDistance(arm, b, c)), min(segmentDistance(arm, c, d), segmentDistance(arm, d, a)));
      color += AMBER * glow(edge * px) * 0.36;
    }
    float hub = cos(mod(turn, PI / 3.0) - PI / 6.0) * r;
    color *= smoothstep(0.10, 0.11, hub);
    color += AMBER * glow(abs(hub - 0.11) * px) * 0.8;
    color = frameColor + color * (1.0 - reveal);
    float sweep = fract((PI * 0.5 - angle) / TAU + 1.0);
    float progress = step(sweep, u_portal.y) * step(0.001, u_portal.y);
    color += stateColor * glow(abs(r - 0.79) * px) * progress;
    float incoming = step(6.5, u_command.z) * (1.0 - step(7.5, u_command.z));
    float commandRadius = mix(0.12 + u_command.x * 0.8, 0.92 - u_command.x * 0.75, incoming);
    vec3 commandColor = mix(CYAN, vec3(1.0, 0.23, 0.27), u_command.w);
    color += commandColor * glow(abs(r - commandRadius) * px) * u_command.y;
    if (open > 0.5) {
      // Keep the field at its final scale; only the aperture threshold expands.
      occlusion = 1.0;
      if (reveal > 0.0 && r < 1.05) {
        float edge;
        vec3 swirl = portalSwirl(p, u_phase / 0.8, edge);
        float outerFade = 1.0 - smoothstep(0.78, 0.84, r);
        float apertureDistance = mix(r, edge, smoothstep(0.0, 0.2, r));
        occlusion = max(smoothstep(0.59 * reveal, 0.70 * reveal, apertureDistance), 1.0 - outerFade);
        float rim = smoothstep(0.43, 0.60, edge) * (1.0 - smoothstep(0.75, 0.83, edge)) * outerFade;
        color += swirl * rim * reveal;
        color += vec3(1.0, 0.49, 0.08) * exp(-abs(edge - 0.66) * 45.0) * reveal * outerFade * 0.28;
      }
    }
  }
  // Phosphor texture is confined to the instruments, never applied to text.
  color *= 0.96 + 0.04 * cos(gl_FragCoord.y * PI);
  // Match the instrument housing where the shader hides the photograph.
  color += vec3(8.0, 7.0, 7.0) / 255.0 * occlusion;
  float alpha = clamp(max(occlusion, max(color.r, max(color.g, color.b))), 0.0, 1.0);
  gl_FragColor = vec4(color / max(alpha, 0.001), alpha);
}
