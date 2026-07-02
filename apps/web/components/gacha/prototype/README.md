# Gacha Reveal — standalone prototype

A self-contained prototype of the "slash/tap to open → reveal" gacha animation, in the
**manga / hand-drawn (pencil + wobble)** art direction described in
[`../ANIMATION_PLAN.md`](../ANIMATION_PLAN.md).

> Throwaway prototype, **not wired into the Next.js app**. It's vendored as plain HTML +
> three.js so it runs with zero build. The real version will be ported into
> `apps/web/components/gacha/` as React Three Fiber components.

## Run it

```bash
cd apps/web/components/gacha/prototype
python3 -m http.server 8137        # or any static server
# open http://localhost:8137
```

(Needs a server — ES-module imports + textures won't load from `file://`.)

## The sequence

Loading gate (spinner) preloads all assets + **pre-compiles every shader** → then you can play:
**slash/tap ~7×** to charge (code-glyph "data" streams into the Earth, which grows + the whole
field gets more frantic per click) → **inverted freeze + shatter**, the planet blows apart and the
side objects are **blasted outward** → a **beam launches up**, whites out, and **slams down onto the
moon** with a multi-ring shockwave + dust plume → the relic **inks in** on the cratered surface
amid a broken Earth, floating stars, a landed ship and a hovering UFO → **GET!!**.

## In-browser editors (query params)

- **`?edit`** — the earth-scene space objects: drag, pick a shape + `+ add`, size slider, `copy`.
- **`?editmoon`** — the moon scene:
  - **Craters**: `+ crater`, drag, slider/wheel to resize, right-click delete, `x` removes last.
  - **Props** (ship / UFO / Earth / stars): click to select, then **drag = X/Z**, **Y slider = height**,
    **rX/rY/rZ sliders = orientation**, **size slider = scale** (separation for the Earth).
  - `+ star` adds a star.
  - **`copy`** outputs `CRATERS=[…]` plus a line per prop: `NAME pos=[x,y,z] s=.. rot=[rx,ry,rz]`
    (Earth also `sep=`). Paste those back into `index.html` to bake new defaults.

Baked layouts (craters, Earth, stars, ship, UFO) live as the defaults inside `index.html`.

## How the look works (two layers)

- **Per-object pencil/hatch** — every material samples `assets/textures/hatch.png` (Blender
  "Chaotic" sketch texture) in screen space and composites ink/paper bands, with a per-frame
  "boil". The moon adds craters + maria + rolling relief; the props/Earth share the moon's hatch
  + directional lighting (same light `uL1`) so everything reads consistently.
- **Global wobble** — one SVG `feTurbulence` + `feDisplacementMap` filter on the whole canvas
  (`#gl`), reseeded ~9 fps, so every edge wobbles together. **Always on.**

## Performance

- Loading gate **pre-compiles shaders + uploads textures** before play (no first-use hitch).
- The burst + moon scenes render at **reduced resolution** (the moon shader + wobble filter are
  the heaviest per-pixel costs); the moon crater loop skips the `sqrt` for far craters.
- The Meshy models are dense (`ufo.glb` ~295k tris, `rocket.glb` similar) — decimate before prod.

### Auto quality (default — nobody should see lag)

Quality now manages itself, no query params needed:

- **Starting tier**: phones / ≤4-core / ≤4 GB devices start at `med`, everything else at `high`
  (a previously saved tier wins).
- **Governor**: after the load gate, real FPS is measured in ~1.6 s windows. Under **45 fps**
  → drop a tier (`high → med → low`). Over **57 fps** sustained ~8 s → earn a tier back.
- **Sticky**: the settled tier is saved to `localStorage` (`gachaQ`), so repeat visits start
  right immediately.
- Disabled in `?edit` / `?record` / `?demo` / `?freeze` modes, when `?q=` pins a tier, or the
  moment you hand-tune anything in the `?perf` panel.

### Perf tuner (`?perf`)

Add **`?perf`** (or `?fps`) to reveal a collapsible top-left panel: live **FPS / draw-calls / tri
count**, plus knobs for every runtime cost — render resolution, the wobble filter (on / reseed Hz /
displacement), the moon shader (craters / relief / grain / maria), data-glyph budget, bg stars, deco
objects, impact FX, and the invert flash. `high / med / low` preset buttons retune everything at once.
**`?q=high|med|low`** forces a tier without opening the panel (for A/B'ing on a real device). The
wobble `feDisplacementMap` is the single biggest per-pixel cost — the `low` preset disables it.

## Recording a clip

The page exposes a `?record` mode (skips the gate, exposes `window.__rec.hit/reset/info`). A
CDP-screencast recorder against a GPU Chrome was used to capture the showcase MP4; software
headless is too slow (~5 fps).

## Layout
```
index.html              the whole prototype (scene, shaders, state machine, editors)
lib/                    vendored three.js r0.181 (module + core + tsl)
addons/                 GLTFLoader + BufferGeometryUtils (three examples)
assets/textures/        00_earthmap (data), 02_earthspec (land/ocean mask), paper.png, hatch.png
assets/models/          sun.glb, reward.glb, rocket.glb, ufo.glb
```

## TODO before production
- **`assets/models/reward.glb` is a placeholder** (a Brawl Stars "mortis" fan model). Replace with
  an owned/licensed reward model.
- Compress/decimate the heavy assets (`paper.png` ~7 MB, `sun.glb`/`rocket.glb`/`ufo.glb` are big).
- three.js is vendored for a buildless demo; the real component uses the app's own `three` /
  `@react-three/fiber`.
