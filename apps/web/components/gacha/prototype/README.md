# Gacha Reveal — standalone prototype

A self-contained prototype of the "slash/tap to open → reveal" gacha animation, in the
**manga / hand-drawn (pencil + wobble)** art direction described in
[`../ANIMATION_PLAN.md`](../ANIMATION_PLAN.md).

> This is a **throwaway prototype**, not wired into the Next.js app. It's vendored as plain
> HTML + three.js so it runs with zero build. The real version will be ported into
> `apps/web/components/gacha/` as proper React Three Fiber components (see the plan).

## Run it

```bash
cd apps/web/components/gacha/prototype
python3 -m http.server 8137        # or any static server
# open http://localhost:8137
```

(Needs a server — ES module imports + textures won't load from `file://`.)

## What it does

Charge by tapping/slashing (code-glyph "data" streams into the earth, which grows + shakes) →
on the 6th hit it **freezes inverted**, then **shatters** → a **beam launches up** and **comes
back down onto the moon** → the relic **inks in** on the cratered moon surface (manga hatch),
front-facing → **GET!!**.

### Editor modes (query params)
- `?edit` — drag the space objects; pick a shape from the dropdown + **add**; **size slider**;
  **copy** button outputs `label:[x,y,z] s=scale`.
- `?editmoon` — place craters: **+ crater**, drag to move, slider/scroll to resize, right-click
  to delete, **copy** outputs the `CRATERS=[...]` array.

Baked layouts (object positions/sizes + crater list) live as the defaults inside `index.html`.

## How the look works (two layers)
- **Per-object pencil/hatch** — each material samples `assets/textures/hatch.png` (Blender
  "Chaotic" sketch texture) in screen space and composites ink/paper bands, with a per-frame
  "boil" so strokes redraw. The moon adds worley craters + maria + rolling relief.
- **Global wobble** — one SVG `feTurbulence` + `feDisplacementMap` filter on the whole canvas
  (`#gl`), reseeded ~9 fps, displaces the rendered image so every edge wobbles together.

## Layout
```
index.html              the whole prototype (scene, shaders, state machine, editors)
lib/                    vendored three.js r0.181 (module + core + tsl)
addons/                 GLTFLoader + BufferGeometryUtils (three examples)
assets/textures/        earth maps (data only), paper.png, hatch.png
assets/models/          sun.glb, reward.glb
```

## Notes / TODO before production
- **`assets/models/reward.glb` is a placeholder** (a Brawl Stars "mortis" fan model used only to
  test the reveal). Replace with an owned/licensed reward model before shipping.
- `paper.png` (~7 MB) and `sun.glb` (~7 MB) are heavy source assets — compress/swap when porting.
- three.js is vendored here for a buildless demo; the real component will use the app's own
  `three` / `@react-three/fiber` dependencies.
- Manga shader is grounded in the `blender-to-threejs` `sketch-shader-spec` (hatch bands) and the
  Manga-Diamond material; see `../ANIMATION_PLAN.md`.
