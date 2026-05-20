export const GLOBE_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Photorealistic Earth — minimal processing, let the NASA texture speak.
// Small saturation nudge, gentle directional light, subtle ocean specular.
// Night side = #0a0f1e (site background) so the sphere edge is invisible.
export const GLOBE_FRAG = /* glsl */`
  uniform sampler2D earthTex;
  uniform vec3 lightDir;
  uniform vec2 texelSize;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  vec3 nudgeSat(vec3 c, float s) {
    float g = dot(c, vec3(0.299, 0.587, 0.114));
    return mix(vec3(g), c, s);
  }

  // Gentle unsharp-mask: sharpens at 2-texel radius, strength 0.4 (not aggressive)
  vec4 sharpSample(vec2 uv) {
    vec2 d = texelSize * 2.0;
    vec4 center = texture2D(earthTex, uv);
    vec4 blur = (
      texture2D(earthTex, uv + vec2(-d.x, 0.0)) +
      texture2D(earthTex, uv + vec2( d.x, 0.0)) +
      texture2D(earthTex, uv + vec2(0.0, -d.y)) +
      texture2D(earthTex, uv + vec2(0.0,  d.y))
    ) * 0.25;
    return clamp(center + (center - blur) * 0.40, 0.0, 1.0);
  }

  void main() {
    vec4 tex = sharpSample(vUv);

    // Lighting — smooth terminator
    float ndl = max(0.0, dot(normalize(vNormal), normalize(lightDir)));
    float t   = smoothstep(0.0, 0.50, ndl);

    // Day: tiny saturation nudge (1.08 — barely perceptible, no fake HDR)
    vec3 day = nudgeSat(tex.rgb, 1.08);

    // Very slight warm nudge on arid terrain (deserts, steppes)
    float warm = clamp((tex.r - tex.b - 0.08) * 2.0, 0.0, 1.0);
    day = mix(day, day * vec3(1.06, 1.02, 0.88), warm * 0.18);

    // Night: exact background color — seamless blend at sphere edge
    vec3 night = vec3(0.039, 0.059, 0.118);
    // City lights: very faint warmth on dark side
    night += tex.r * 0.035 * (1.0 - t) * vec3(1.0, 0.80, 0.45);

    vec3 color = mix(night, day, t);

    // Ocean specular — subtle, realistic (not vivid blue)
    float ocean = 1.0 - clamp((tex.r - 0.10) * 3.0, 0.0, 1.0);
    vec3 V      = normalize(-vPosition);
    vec3 R      = reflect(-normalize(lightDir), normalize(vNormal));
    float spec  = pow(max(0.0, dot(R, V)), 32.0);
    color += ocean * spec * 0.07 * vec3(0.5, 0.65, 0.9) * t;

    gl_FragColor = vec4(color, 1.0);
  }
`

export const ATMO_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Inner atmosphere: thin cobalt-blue crescent, like real Rayleigh scattering photos.
// High power (4.0) = tight ring, not a thick glow.
export const ATMO_INNER = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float r = pow(1.0 - abs(dot(normalize(vNormal), normalize(-vPosition))), 4.0);
    // Cobalt blue — matches real ISS Earth photos, not cyan
    vec3 col = vec3(0.20, 0.52, 0.88);
    gl_FragColor = vec4(col, r * 0.72);
  }
`

// Outer atmosphere: barely-there blue halo, only at extreme edges.
// Very low opacity (0.14) — just enough to feel three-dimensional.
export const ATMO_OUTER = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float r = pow(1.0 - abs(dot(normalize(vNormal), normalize(-vPosition))), 2.5);
    vec3 col = vec3(0.10, 0.28, 0.70);
    gl_FragColor = vec4(col, r * 0.14);
  }
`
