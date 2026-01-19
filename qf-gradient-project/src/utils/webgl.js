/**
 * WebGL Utility Functions
 */

/**
 * Create and compile a shader
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation error: ${error}`);
  }
  
  return shader;
}

/**
 * Create and link a program from vertex and fragment shaders
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${error}`);
  }
  
  return program;
}

/**
 * Create a fullscreen quad buffer
 */
export function createQuadBuffer(gl) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,  // Bottom left
       1, -1,  // Bottom right
      -1,  1,  // Top left
       1,  1,  // Top right
    ]),
    gl.STATIC_DRAW
  );
  return buffer;
}

/**
 * Set up position attribute
 */
export function setupPositionAttribute(gl, program, buffer) {
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

/**
 * Get all uniform locations for the gradient shader
 */
export function getUniformLocations(gl, program) {
  return {
    time: gl.getUniformLocation(program, 'u_time'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    color1: gl.getUniformLocation(program, 'u_color1'),
    color2: gl.getUniformLocation(program, 'u_color2'),
    color3: gl.getUniformLocation(program, 'u_color3'),
  };
}

/**
 * Resize canvas to match display size with DPR
 */
export function resizeCanvas(canvas, gl, uniforms, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio, maxDpr);
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width * dpr);
  const height = Math.floor(rect.height * dpr);
  
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(uniforms.resolution, width, height);
    return true;
  }
  return false;
}

/**
 * Linear interpolation for color transitions
 */
export function lerpColor(current, target, t) {
  return current.map((c, i) => c + (target[i] - c) * t);
}

/**
 * Check if WebGL is supported
 */
export function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default {
  createShader,
  createProgram,
  createQuadBuffer,
  setupPositionAttribute,
  getUniformLocations,
  resizeCanvas,
  lerpColor,
  isWebGLSupported,
};
