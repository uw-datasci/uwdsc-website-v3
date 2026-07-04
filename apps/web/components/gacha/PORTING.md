# Gacha reveal — prototype → component port notes

`prototype/index.html` remains the animation's source of truth (it runs standalone,
see its README). `engine.ts` is a **mechanical port** of the prototype's script;
if the prototype changes, re-apply these transforms rather than hand-diffing:

| Prototype | Component | Why |
|---|---|---|
| vendored `./lib/three.module.js` imports | `three` / `three/addons/...` from npm (`three@0.181`, matching the vendored r181) | real dependency, tree-shaken, lazy-loaded |
| `document.getElementById(x)` | `$id(x)` (queries inside the component root) | no global DOM assumptions |
| bare / `window.addEventListener` | `_on(window, ...)` (tracked) | removed in `destroy()` |
| `requestAnimationFrame(frame)` | `_raf = requestAnimationFrame(frame)` + `if (_destroyed) return` guard | cancellable loop |
| `location.search` (dev modes: `?perf`, `?edit`, `?demo`, ...) | `_LS` from `opts.debugQuery` | app URLs can't accidentally trigger dev modes; pass `debugQuery: "perf"` to get the perf panel |
| `'assets/...'` paths | `_A + '/...'` with `assetBase` option (default `/gacha/assets`) | assets live in `public/gacha/` |
| `paper.png` (6.8MB) / `hatch.png` (2.2MB) | `paper.jpg` / `hatch.jpg` (sips q75-85) | 10.6MB → 4.0MB total; both are sampled as RGB, no alpha needed |
| — | `destroy()`: cancel RAF, remove listeners, `renderer.dispose()` + `loseContext()`, clear DOM | repeated open/close must not leak WebGL contexts |
| — | `opts.onComplete` fired once at the settle/GET moment | lets the app award the actual prize |
| body HTML / CSS | `template.ts` / `gacha.css` (all selectors scoped under `.gacha-root`) | nothing leaks into site styles |

## Still TODO before production

- **Replace `reward.glb`** — placeholder fan model, not shippable.
- The modal is **fullscreen-only by design** (the shake/whiteout/invert sequence
  needs the whole viewport). If a boxed version is ever demanded, the engine's
  `innerWidth/innerHeight` uses must become container-rect reads.
- Fonts load from Google Fonts at open; switch to `next/font` if the team
  prefers self-hosting.
- `app/gacha-demo/` is a dev route — delete or gate before production.
