/**
 * QF Animated Gradient Component
 * 
 * WebGL-based animated gradient background inspired by Runway ML Demo Day.
 * Uses 3D Simplex Noise with FBM for organic, cloud-like color transitions.
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { THEMES } from '../config/themes';
import {
  createShader,
  createProgram,
  createQuadBuffer,
  setupPositionAttribute,
  getUniformLocations,
  resizeCanvas,
  lerpColor,
  isWebGLSupported,
} from '../utils/webgl';

// Inline shaders (alternatively import from .glsl files with a bundler)
const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.6;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 1.8;
    }
    return value;
  }
  
  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 coord = vec2(uv.x * aspect, uv.y);
    float t = u_time * 0.12;
    float noiseScale = 0.8;
    
    float noise1 = fbm(vec3(coord * noiseScale, t * 0.4));
    float noise2 = fbm(vec3(coord * noiseScale * 1.5 + 50.0, t * 0.6 + 100.0));
    float noise3 = fbm(vec3(coord * noiseScale * 2.5 + 100.0, t * 0.8 + 200.0));
    
    float combinedNoise = noise1 * 0.55 + noise2 * 0.3 + noise3 * 0.15;
    combinedNoise = combinedNoise * 0.6 + 0.5;
    combinedNoise = smoothstep(0.2, 0.8, combinedNoise);
    
    float verticalGradient = uv.y;
    float blendFactor = mix(verticalGradient, combinedNoise, 0.65);
    
    vec3 color;
    if (blendFactor < 0.5) {
      float t = smoothstep(0.0, 1.0, blendFactor * 2.0);
      color = mix(u_color1, u_color2, t);
    } else {
      float t = smoothstep(0.0, 1.0, (blendFactor - 0.5) * 2.0);
      color = mix(u_color2, u_color3, t);
    }
    
    color *= 1.0 + (noise1 * 0.12);
    
    float vignette = 1.0 - length((uv - 0.5) * 0.4);
    vignette = smoothstep(0.0, 1.0, vignette);
    color = mix(color * 0.92, color, vignette);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * AnimatedGradient Component
 * 
 * @param {string} theme - Theme key from THEMES config
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {function} onError - Callback if WebGL fails
 */
export default function AnimatedGradient({
  theme = 'ai',
  className = '',
  style = {},
  onError = null,
}) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const uniformsRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  const currentColorsRef = useRef(null);
  const targetColorsRef = useRef(null);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support
    if (!isWebGLSupported()) {
      onError?.('WebGL not supported');
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      onError?.('Failed to get WebGL context');
      return;
    }

    glRef.current = gl;

    try {
      // Create shaders and program
      const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = createProgram(gl, vs, fs);
      gl.useProgram(program);

      // Set up geometry
      const buffer = createQuadBuffer(gl);
      setupPositionAttribute(gl, program, buffer);

      // Get uniform locations
      uniformsRef.current = getUniformLocations(gl, program);

      // Initialize colors
      const themeConfig = THEMES[theme] || THEMES.ai;
      currentColorsRef.current = themeConfig.colors.map(c => [...c]);
      targetColorsRef.current = themeConfig.colors.map(c => [...c]);

      // Handle resize
      const handleResize = () => {
        resizeCanvas(canvas, gl, uniformsRef.current);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // Animation loop
      const render = (now) => {
        if (!glRef.current || !uniformsRef.current) return;

        // Interpolate colors
        if (currentColorsRef.current && targetColorsRef.current) {
          for (let i = 0; i < 3; i++) {
            currentColorsRef.current[i] = lerpColor(
              currentColorsRef.current[i],
              targetColorsRef.current[i],
              0.05
            );
          }

          gl.uniform3fv(uniformsRef.current.color1, currentColorsRef.current[0]);
          gl.uniform3fv(uniformsRef.current.color2, currentColorsRef.current[1]);
          gl.uniform3fv(uniformsRef.current.color3, currentColorsRef.current[2]);
        }

        // Update time
        const elapsed = (now - startTimeRef.current) / 1000;
        gl.uniform1f(uniformsRef.current.time, elapsed);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationRef.current = requestAnimationFrame(render);
      };

      animationRef.current = requestAnimationFrame(render);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      onError?.(error.message);
    }
  }, [onError]);

  // Update colors when theme changes
  useEffect(() => {
    const themeConfig = THEMES[theme] || THEMES.ai;
    if (targetColorsRef.current) {
      targetColorsRef.current = themeConfig.colors.map(c => [...c]);
    }
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}

export { THEMES };
