# Gacha Reveal Animation — Plan

A "spin / open to unlock" reveal: the user triggers an **open**, suspense builds, the container
**bursts**, and the reward **draws itself into existence** in a hand-drawn ink style, then settles
into a hero pose. Built **live in WebGL** with React Three Fiber + custom GLSL, reusing Daniel's
existing Blender → Three.js shader work.

> **Scope:** the **animation sequence** + **technical architecture**. The identity of the unlocked
> "thing" (critter/badge) and its rarity art are out of scope for now — the reveal is built
> reward-agnostic so any GLB can drop in. The reveal is **cosmetic**; the result is server-decided.

---

## 0. Creative direction — render the whole thing in the ink/crosshatch NPR style

The standout asset in Daniel's 3D work is a **procedural crosshatch ink shader** (NPR, hand-drawn
illustration look) — `Dev/3D/sketch/sketch shader v1.0.blend`, with a node-for-node Three.js port
already specced. Instead of a generic glowy loot-box, we render the **entire gacha reveal as ink on
paper**, and the "evolve" is the reward **literally drawing itself in, stroke by stroke** via baked
reveal maps. This is far more distinctive, on-brand for a *data science* club's illustrative vibe,
and reuses his most mature pipeline.

Look & feel: lined-paper backdrop, crosshatch shading that deepens in shadow, a wobbly ink outline,
and a "wet ink" leading edge as forms are drawn on. Rarity is expressed in **ink color** (linear
RGB), outline weight, and hatch density — not bloom.

---

## 1. Repo constraints (from exploration)

- **Stack:** Next.js 16 (app router) · React 19 · Tailwind v4 · TS. Animation today is **Framer
  Motion only** — no three.js/r3f/gsap/WebGL anywhere.
- **New deps** (add from repo root with `pnpm`, per `CLAUDE.md`): `three`, `@react-three/fiber`,
  `@react-three/drei`. `@react-three/postprocessing` only if we keep bloom (the ink look may not
  need it). The entire 3D layer must be **lazy-loaded** (`next/dynamic`, `ssr:false`) so it stays
  out of the main bundle (none of it ships today).
- **Assets:** static files in `public/`; no `public/models/` yet — add `public/gacha/`.
  Image optimization is disabled (Vercel quota) → keep textures small, prefer compressed GLB.

---

## 2. Reference index — reuse, don't reinvent

### A. The ink pipeline R&D repo — `Dev/projects/2026/blender-to-threejs/docs/`
The governing rule: *"transfer what's deterministic; bake/reimplement what's simulated."*
- `reference/sketch-shader-spec.md` — **the** node-for-node Blender→Three.js spec for the crosshatch
  shader (lights, EEVEE settings, 138-node material graph, band math). This is our shader bible.
- `reference/conversion-learnings.md` — **reveal maps** (bake reveal-time in R + blob mask in A by
  rendering orthographically across frames) ← this is our "draw-on / evolve" mechanism; **VAT**
  (vertex animation texture) for deforming geometry; **outlines** = normal-inflate hull.
- `GOTCHAS.md` — colorspace (AO/roughness/normal MUST be NoColorSpace; sRGB decode darkens
  0.7→0.46); rotations via **quaternion** (Euler XYZ differs); **screen-space AO ghosts on moving
  meshes → use UV-baked AO** (critical: our reward rotates); rig export NaN → strip attribute layers,
  bake clean eval geometry.
- `reference/feature-matrix.md`, `PROJECT-BRIEF.md` — what transfers exactly vs approximates vs bakes.
- Source scenes: `Dev/3D/sketch/sketch shader v1.0.blend`, `Dev/3D/inktool/` (`intro_web.blend`,
  `goldfish.blend`, baked AO PNGs, `*.glb` exports), hatch textures in `Dev/3D/sketch/`.

### B. Three.js shader/code patterns already written
- `rainbolt.ai/frontend/components/ui/Globe.tsx` — **fresnel glow** shader (rim halo) + interactive
  **points** shader with vertex displacement; `utils/getStarfield.ts` (Points sprite particles).
- portfolio `lib/carousel-helpers.ts` — `ShaderMaterial` **factory** (uniform-driven compositing,
  vertex displacement, edge glow) → template for our materials.
- portfolio `components/projects/project-slider.tsx` — phase **state machine**, rAF loop, object
  **pooling**, GPU **warmup** (`renderer.compile`), lazy textures.
- portfolio `lib/animation-utils.ts` — `easeOutQuart` + multi-axis sine **float**.
- portfolio `components/three/butterfly-model.tsx` — `useGLTF` + `useAnimations` GLB loading.

---

## 3. The animation sequence (phase state machine, ink-styled)

Each phase exposes normalized `t ∈ [0,1]` advanced in `useFrame`; transitions use eased `t`
(`easeOutQuart`, `easeOutBack` for overshoot). Mirrors the portfolio's idle→…→collapsing machine.

| # | Phase | ~Dur | What happens (ink language) | Key uniforms |
|---|-------|------|------------------------------|--------------|
| 0 | **IDLE** | loop | Capsule/inkwell drawn in crosshatch on lined paper; soft ink outline; gentle float; faint "wet" shimmer. | `uHatchScale`, `uTime`, float |
| 1 | **CHARGE** | 0.6–1.0s | Hatch **deepens** (push shade darker → denser ink), linework **jitters** (band-sharpness + hatch-UV wobble), paper grain rises, ink droplets gather inward. Camera dolly in. *(Wheel variant: a hatched ring spins, decelerating on `easeOutQuart`.)* | `uShadeBias`↑, `uJitter`↑, particle vel inward |
| 2 | **BURST** | ~0.3s | Capsule **un-draws** — reveal map runs **reverse** (`uReveal` 1→0) so strokes erase — plus an **ink-splatter** Points burst (blots flung out) and a paper flash that masks the mesh swap. | `uReveal` 1→0, splatter vel out |
| 3 | **REVEAL / EVOLVE** | 0.8–1.2s | Reward **draws itself in**: baked reveal map R = per-fragment draw time, `uReveal` 0→1 sweeps strokes on in author order; A = blob mask → "wet ink" leading edge. Optional **VAT** morph as it forms. Crosshatch resolves sparse→full. **Inked outline** strokes on last. `easeOutBack` settle + rotation slerp to hero angle. | `uReveal` 0→1, `uEdgeInk`, `uOutline`, `uInkColor` |
| 4 | **SETTLE** | loop | Hero pose: slow **turntable** (uses **UV-baked AO** so no ghosting), hatch shimmer, paper overlay, rarity aura via ink color + outline weight + extra hatch layer. Label + Claim/Again fade in (Framer Motion DOM). | float, `uHatchShimmer` |
| → | **DISMISS** | 0.4s | On claim: reward un-draws or flies off; overlay fades; Canvas unmounts (free GPU). | `uReveal`↓, opacity↓ |

Optional gacha fake-out (between 2–3): reveal a common-tier ink color, hold ~0.4s, second splatter
"upgrades" to a rare tier. Result still server-decided.

---

## 4. Shader stack (custom `ShaderMaterial`s, uniforms driven from `useFrame`)

Built on the `carousel-helpers.ts` factory pattern; **signature ink shader is ported from
`sketch-shader-spec.md`.**

1. **Crosshatch ink (signature)** — port of the spec:
   - Manual lighting: two directional lights (Sun 5.0 + fill 3.0), per-light `N·L` + GGX spec +
     world ambient → `shade = clamp(brightness*(5·nDotL+3·nDotLfill)/π + amb + spec, 0,1)`; overlay
     tone-map vs 0.32.
   - Band sharpness float-curve ≈ `0.573·x³`; **3 Map-Range bands** → `ink0/ink1/ink2` (darks/mids/
     lights).
   - Hatch texture (RGB = 3 layers, e.g. *Chaotic Texture.png*), **screen-space UV** scaled by pixel
     aspect; multiply-from-white: `m0=mix(1,texR,ink0); m1=m0*mix(1,texG,ink1); m2=m1*mix(1,texB,ink2)`.
   - **UV-baked AO** darken (NoColorSpace): `aoDarken=(1-clamp((AO-0.6556)/0.3444,0,1))*amt`.
   - HSV value variation; final `mix(inkColor, paperColor, m2)`. Ink color in **linear RGB**.
2. **Reveal / draw-on** (the evolve) — sample baked reveal map: R=draw time, A=blob. `drawn =
   step(R, uReveal)`; leading-edge ink where `abs(R-uReveal) < band` (wet edge); composited with #1.
   Reused **reversed** for the burst un-draw.
3. **Inverted-hull outline** — duplicate mesh, `side: BackSide`, `pos += normal*uOutline`, ink/black,
   `renderOrder:-1`. Animate `uOutline` on during reveal. (Normal-inflate, *not* scale-hull.)
4. **Ink-splatter particles** — `THREE.Points`, blob sprite, burst velocities (out on burst, in on
   charge), normal/multiply blend (ink is dark, not additive). Pattern from `getStarfield.ts`.
5. **Fresnel rim** (optional, subtle) — from `Globe.tsx` glow, for a faint rarity halo only.
6. **Paper overlay** — DOM layer: `paper.jpg` with `mix-blend-mode: multiply` over the canvas
   (Daniel's portfolio technique), not a shader.

---

## 5. Blender → web pipeline (apply the GOTCHAS)

1. Author capsule + reward in the sketch-shader scene (`Dev/3D/sketch` / `inktool`).
2. **Bake reveal maps** (orthographic render across frames → R=reveal time, A=blob mask) — per
   `conversion-learnings.md`. This drives the draw-on evolve.
3. **Bake UV AO** as **NoColorSpace**, sampled by UV (never screen-space — the reward rotates).
4. **Export GLB**: decompose transforms to **quaternion**; **strip attribute layers / bake clean
   eval geometry** to avoid rig NaN; Draco/meshopt compress (cf. `butterfly_compressed.glb`).
5. Hatch textures → load as **NoColorSpace** data textures, byte-identical to Blender.
6. **VAT** only if the reward deforms during evolve.
7. Outputs → `apps/web/public/gacha/{models,textures}/`.

---

## 6. Component / file structure (`apps/web/components/gacha/`)

```
gacha/
  ANIMATION_PLAN.md          ← this file
  GachaReveal.tsx            ← public entry: fullscreen overlay + <Canvas>, lazy-loaded
  index.ts                   ← dynamic() wrapper (ssr:false)
  scene/
    RevealScene.tsx          ← scene graph + phase clock + camera rig + paper backdrop
    Capsule.tsx              ← container (idle/charge/un-draw)
    Reward.tsx               ← reward GLB (useGLTF) + reveal-map material; primitive placeholder now
    InkOutline.tsx           ← inverted-hull outline pass
    Splatter.tsx             ← ink-blot Points system
  shaders/
    crosshatch.glsl.ts       ← signature ink (ported from sketch-shader-spec.md)
    reveal.glsl.ts           ← draw-on / un-draw
    outline.glsl.ts          ← normal-inflate hull
    splatter.glsl.ts         ← particles
  lib/
    phases.ts                ← Phase enum + durations + transition table
    easing.ts                ← easeOutQuart / easeOutBack / float (ported)
    usePhaseClock.ts         ← advances t, fires transitions, respects reduced-motion
  ui/
    RevealOverlay.tsx        ← Framer Motion DOM: paper overlay, label, Claim/Again, backdrop
```

`GachaReveal` takes a `result` prop (server-decided) + `onClaim`. State via ref-based
`usePhaseClock` (no global store needed).

---

## 7. Performance & accessibility

- **Lazy-load** the whole `<Canvas>` (`next/dynamic`, `ssr:false`); preload on hover/intent.
- **GPU warmup** (`renderer.compile`) before opening so the first frame doesn't hitch; **pool**
  particle geo/materials (portfolio patterns).
- Cap `dpr` on mobile (`<Canvas dpr={[1,2]}>`); throttle hatch detail + particle count by device.
- **`prefers-reduced-motion`**: skip the cinematic, cut to phase 4 (static inked reveal + fade).
  Always provide a non-WebGL fallback (static inked PNG) if context is lost.
- Unmount Canvas on dismiss to free GPU memory.

---

## 8. Build order

1. Deps + bare lazy `<Canvas>` overlay that opens/closes (no content). Confirm bundle stays split.
2. Phase clock + state machine on primitives (box→sphere); log phase transitions.
3. Port the **crosshatch ink** shader onto a primitive + paper overlay (validate against the spec).
4. **Reveal map** draw-on on a test GLB (the evolve) + inverted-hull outline.
5. Ink-splatter particles + charge/burst beats; wire camera dolly.
6. Swap in real reward GLB via `useGLTF`; wire rarity (ink color / outline / hatch density).
7. Framer Motion UI + reduced-motion / fallback paths.
8. Hook the trigger + `result` prop to wherever "open" fires (TBD).

---

## 9. Open decisions (need input)

- **Container form & motion:** ink capsule vs inkwell vs box vs **hatched spinning wheel**?
- **Rarity tiers:** how many; do we want the fake-out → upgrade beat?
- **Trigger surface:** where in the app does "open" live, and what hands us the `result`?
- **Reward source:** Blender GLB (which scene) vs placeholder — out of scope for now.
- **postprocessing/gsap:** likely skippable (ink look + phase clock + Framer Motion). Decide once
  the UI beats are real.
