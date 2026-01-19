/**
 * Fragment Shader - Runway-style organic noise gradient
 * 
 * Uses 3D Simplex Noise with Fractal Brownian Motion (FBM)
 * to create organic, cloud-like color transitions.
 */

precision highp float;

varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;  // Top color
uniform vec3 u_color2;  // Middle color
uniform vec3 u_color3;  // Bottom color

// ===========================================
// TUNABLE PARAMETERS
// ===========================================
#define NOISE_SCALE 0.8        // Lower = bigger blobs (0.5-1.5)
#define SPEED 0.12             // Animation speed (0.08-0.2)
#define NOISE_BLEND 0.65       // Noise vs gradient mix (0.5-0.8)
#define CONTRAST_MIN 0.2       // Smoothstep lower bound
#define CONTRAST_MAX 0.8       // Smoothstep upper bound
#define BRIGHTNESS_VAR 0.12    // Brightness variation amount
#define FBM_OCTAVES 3          // Noise detail level (2-4)

// ===========================================
// SIMPLEX 3D NOISE
// ===========================================
vec4 permute(vec4 x) { 
  return mod(((x * 34.0) + 1.0) * x, 289.0); 
}

vec4 taylorInvSqrt(vec4 r) { 
  return 1.79284291400159 - 0.85373472095314 * r; 
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  
  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  
  // Permutations
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
  // Gradients
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
  
  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  
  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ===========================================
// FRACTAL BROWNIAN MOTION
// ===========================================
float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.6;
  float frequency = 1.0;
  
  for (int i = 0; i < FBM_OCTAVES; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 1.8;
  }
  return value;
}

// ===========================================
// MAIN
// ===========================================
void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 coord = vec2(uv.x * aspect, uv.y);
  
  // Time with speed multiplier
  float t = u_time * SPEED;
  
  // Multi-layer noise for organic movement
  // Layer 1: Primary large swirls
  float noise1 = fbm(vec3(coord * NOISE_SCALE, t * 0.4));
  
  // Layer 2: Secondary movement (offset to decorrelate)
  float noise2 = fbm(vec3(coord * NOISE_SCALE * 1.5 + 50.0, t * 0.6 + 100.0));
  
  // Layer 3: Fine detail
  float noise3 = fbm(vec3(coord * NOISE_SCALE * 2.5 + 100.0, t * 0.8 + 200.0));
  
  // Combine layers with weights favoring large swirls
  float combinedNoise = noise1 * 0.55 + noise2 * 0.3 + noise3 * 0.15;
  
  // Map to 0-1 range and add contrast
  combinedNoise = combinedNoise * 0.6 + 0.5;
  combinedNoise = smoothstep(CONTRAST_MIN, CONTRAST_MAX, combinedNoise);
  
  // Base vertical gradient
  float verticalGradient = uv.y;
  
  // Blend noise with gradient
  float blendFactor = mix(verticalGradient, combinedNoise, NOISE_BLEND);
  
  // Three-color gradient interpolation
  vec3 color;
  if (blendFactor < 0.5) {
    // Top to middle
    float t = smoothstep(0.0, 1.0, blendFactor * 2.0);
    color = mix(u_color1, u_color2, t);
  } else {
    // Middle to bottom
    float t = smoothstep(0.0, 1.0, (blendFactor - 0.5) * 2.0);
    color = mix(u_color2, u_color3, t);
  }
  
  // Add brightness variation for depth
  float brightness = 1.0 + (noise1 * BRIGHTNESS_VAR);
  color *= brightness;
  
  // Subtle vignette
  float vignette = 1.0 - length((uv - 0.5) * 0.4);
  vignette = smoothstep(0.0, 1.0, vignette);
  color = mix(color * 0.92, color, vignette);
  
  gl_FragColor = vec4(color, 1.0);
}
