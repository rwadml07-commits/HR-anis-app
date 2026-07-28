// Chromatic Waves — animated halftone-dot background rendered with WebGL (ogl).
import { useEffect, useRef } from "react";
import { Renderer, Camera, Mesh, Plane, Program, RenderTarget } from "ogl";

const perlinVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}`;

const perlinFragmentShader = `#version 300 es
precision mediump float;
uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uValue;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  uv = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;
  float hue = abs(snoise(vec3(uv * uFrequency, uTime * uSpeed)));
  vec3 rainbowColor = hsv2rgb(vec3(hue, 1.0, uValue));
  fragColor = vec4(rainbowColor, 1.0);
}`;

const dotVertexShader = perlinVertexShader;

const dotFragmentShader = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform int uPaletteCount;
uniform vec3 uPalette[10];
uniform float uPaletteAlpha[10];
uniform float uCellSize;
uniform float uGamma;
uniform float uPaletteBias;
out vec4 fragColor;

void main() {
  vec2 pix = gl_FragCoord.xy;
  float cell = max(uCellSize, 1.0);

  vec2 cellIdx = floor(pix / cell);
  vec2 cellCenter = (cellIdx + 0.5) * cell;
  vec3 col = texture(uTexture, cellCenter / uResolution.xy).rgb;
  float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
  gray = pow(clamp(gray, 0.0001, 1.0), uGamma);

  vec2 cellUV = fract(pix / cell) - 0.5;
  float dist = length(cellUV);
  float radius = clamp(gray + uPaletteBias, 0.0, 1.0) * 0.5;
  float aa = fwidth(dist) + 1e-4;
  float mark = 1.0 - smoothstep(radius - aa, radius + aa, dist);

  float g2 = clamp(gray + uPaletteBias, 0.0, 1.0);
  int cnt = max(uPaletteCount, 1);
  vec3 dotCol;
  float dotOpacity;
  if (cnt <= 1) {
    dotCol = uPalette[0];
    dotOpacity = uPaletteAlpha[0];
  } else {
    float scaled = g2 * float(cnt - 1);
    int seg = int(floor(scaled));
    seg = clamp(seg, 0, cnt - 2);
    float f = clamp(scaled - float(seg), 0.0, 1.0);
    dotCol = mix(uPalette[seg], uPalette[seg + 1], f);
    dotOpacity = mix(uPaletteAlpha[seg], uPaletteAlpha[seg + 1], f);
  }
  fragColor = vec4(dotCol, mark * dotOpacity);
}`;

function parseColorToRgba(input) {
  if (!input) return { r: 0, g: 0, b: 0, a: 1 };
  const str = String(input).trim();
  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
  );
  if (rgbaMatch) {
    return {
      r: Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255,
      g: Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255,
      b: Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255,
      a: rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1,
    };
  }
  const hex = str.replace(/^#/, "");
  const pair = (i) => parseInt(hex.slice(i, i + 2), 16) / 255;
  const single = (i) => parseInt(hex[i] + hex[i], 16) / 255;
  if (hex.length === 8) return { r: pair(0), g: pair(2), b: pair(4), a: pair(6) };
  if (hex.length === 6) return { r: pair(0), g: pair(2), b: pair(4), a: 1 };
  if (hex.length === 4) return { r: single(0), g: single(1), b: single(2), a: single(3) };
  if (hex.length === 3) return { r: single(0), g: single(1), b: single(2), a: 1 };
  return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

const mapFrequency = (v) => mapLinear(v, 1, 10, 0.3, 6);
const mapSpeed = (v) => v * 0.05;
const mapCellSize = (v) => mapLinear(v, 1, 100, 6, 60);
const mapGamma = (v) => mapLinear(v, 1, 20, 0.5, 8);
const mapPaletteBias = (v) => v * 0.05;

const MAX_COLORS = 10;

function buildPaletteUniforms(colorList) {
  const rgb = [];
  const alpha = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const src = colorList[i];
    if (src != null) {
      const { r, g, b, a } = parseColorToRgba(src);
      rgb.push([r, g, b]);
      alpha.push(a);
    } else {
      rgb.push([0, 0, 0]);
      alpha.push(0);
    }
  }
  return { rgb, alpha };
}

export default function ChromaticWaves({
  frequency = 1,
  speed = 4,
  bgColor = "#000000",
  colors = ["#FFFFFF"],
  cellSize = 34,
  gamma = 6,
  paletteBias = -3,
  paused = false,
  style,
}) {
  const paletteColors = colors.length > 0 ? colors : ["#FFFFFF"];
  const paletteCount = Math.min(MAX_COLORS, paletteColors.length);
  const paletteKey = paletteColors.slice(0, MAX_COLORS).join("|");

  const containerRef = useRef(null);
  const perlinProgramRef = useRef(null);
  const dotProgramRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const perlinMeshRef = useRef(null);
  const dotMeshRef = useRef(null);
  const renderTargetRef = useRef(null);
  const glRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastTimeRef = useRef(0);
  const isPlayingRef = useRef(!paused);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: true,
        premultipliedAlpha: false,
      });
    } catch {
      // No WebGL2 available — leave the background empty rather than crashing.
      return;
    }
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.display = "block";
    rendererRef.current = renderer;
    glRef.current = gl;

    const camera = new Camera(gl, { near: 0.1, far: 100 });
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    const perlinProgram = new Program(gl, {
      vertex: perlinVertexShader,
      fragment: perlinFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: mapFrequency(frequency) },
        uSpeed: { value: mapSpeed(speed) },
        uValue: { value: 1 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      },
    });
    perlinProgramRef.current = perlinProgram;
    const perlinMesh = new Mesh(gl, {
      geometry: new Plane(gl, { width: 2, height: 2 }),
      program: perlinProgram,
    });
    perlinMeshRef.current = perlinMesh;

    const renderTarget = new RenderTarget(gl);
    renderTargetRef.current = renderTarget;

    const palette = buildPaletteUniforms(paletteColors);
    const dotProgram = new Program(gl, {
      vertex: dotVertexShader,
      fragment: dotFragmentShader,
      uniforms: {
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uTexture: { value: renderTarget.texture },
        uPaletteCount: { value: paletteCount },
        uPalette: { value: palette.rgb },
        uPaletteAlpha: { value: palette.alpha },
        uCellSize: { value: mapCellSize(cellSize) },
        uGamma: { value: mapGamma(gamma) },
        uPaletteBias: { value: mapPaletteBias(paletteBias) },
      },
    });
    dotProgramRef.current = dotProgram;
    const dotMesh = new Mesh(gl, {
      geometry: new Plane(gl, { width: 2, height: 2 }),
      program: dotProgram,
    });
    dotMeshRef.current = dotMesh;

    const renderFrame = () => {
      renderer.render({ scene: perlinMesh, camera, target: renderTarget });
      dotProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      renderer.render({ scene: dotMesh, camera });
    };

    const doResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      renderTarget.setSize(gl.canvas.width, gl.canvas.height);
      perlinProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      renderFrame();
    };

    let resizePending = false;
    const scheduleResize = () => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        doResize();
      });
    };
    window.addEventListener("resize", scheduleResize);
    let resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(scheduleResize);
      resizeObserver.observe(container);
    }
    doResize();

    const frameInterval = 1000 / 30;
    const update = (time) => {
      if (!isPlayingRef.current) {
        rafIdRef.current = null;
        return;
      }
      if (time - lastTimeRef.current < frameInterval) {
        rafIdRef.current = requestAnimationFrame(update);
        return;
      }
      lastTimeRef.current = time;
      perlinProgram.uniforms.uTime.value = time * 0.001;
      renderFrame();
      rafIdRef.current = requestAnimationFrame(update);
    };

    isPlayingRef.current = !paused;
    if (isPlayingRef.current) {
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(update);
    }

    // Stop burning GPU cycles while the tab is hidden.
    const onVisibility = () => {
      const shouldPlay = !paused && !document.hidden;
      isPlayingRef.current = shouldPlay;
      if (shouldPlay && rafIdRef.current == null) {
        lastTimeRef.current = 0;
        rafIdRef.current = requestAnimationFrame(update);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isPlayingRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (resizeObserver) resizeObserver.disconnect();
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      perlinProgramRef.current = null;
      dotProgramRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      perlinMeshRef.current = null;
      dotMeshRef.current = null;
      renderTargetRef.current = null;
      glRef.current = null;
      rafIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    const perlin = perlinProgramRef.current;
    const dot = dotProgramRef.current;
    if (perlin) {
      perlin.uniforms.uFrequency.value = mapFrequency(frequency);
      perlin.uniforms.uSpeed.value = mapSpeed(speed);
    }
    if (dot) {
      const palette = buildPaletteUniforms(paletteColors);
      dot.uniforms.uPaletteCount.value = paletteCount;
      dot.uniforms.uPalette.value = palette.rgb;
      dot.uniforms.uPaletteAlpha.value = palette.alpha;
      dot.uniforms.uCellSize.value = mapCellSize(cellSize);
      dot.uniforms.uGamma.value = mapGamma(gamma);
      dot.uniforms.uPaletteBias.value = mapPaletteBias(paletteBias);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency, speed, paletteCount, paletteKey, cellSize, gamma, paletteBias]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: bgColor,
        lineHeight: 0,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
