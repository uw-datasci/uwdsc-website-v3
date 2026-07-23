/** DOM the engine builds inside its root — extracted verbatim from prototype/index.html <body>. */
export const GACHA_TEMPLATE = `
<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs>
  <filter id="sketch" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feTurbulence id="sketchNoise" type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="1" result="n"/>
    <feDisplacementMap id="sketchDisp" in="SourceGraphic" in2="n" scale="19" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>
<canvas id="gl"></canvas>
<div id="flash"></div>
<div id="speed"></div>
<div id="white"></div>
<div id="vig"></div>
<div id="editor"></div>
<button id="copyBtn">copy</button>
<button id="addBtn">+ crater</button>
<button id="addStarBtn">+ star</button>
<select id="objType"><option>asteroid</option><option>planet</option><option>crystal</option><option>cube</option><option>diamond</option><option>dodeca</option><option>tetra</option><option>ring</option><option>knot</option><option>star</option><option>ringplanet</option></select>
<input id="sizeSlider" type="range" min="0.4" max="12" step="0.1" value="1.8">
<div id="ctrl">
  <label>Y&nbsp;<input id="hSlider" type="range" min="-8" max="18" step="0.1" value="3"></label>
  <label>rX<input id="rotX" type="range" min="-3.15" max="3.15" step="0.01" value="0"></label>
  <label>rY<input id="rotY" type="range" min="-3.15" max="3.15" step="0.01" value="0"></label>
  <label>rZ<input id="rotZ" type="range" min="-3.15" max="3.15" step="0.01" value="0"></label>
</div>
<canvas id="fx"></canvas>
<div id="loading"><div class="lspin"></div><div class="ltxt">loading…</div></div>
<div id="grain"></div>
<div id="impact"></div>
<div id="title">DSC · Gacha Reveal — manga earth</div>
<button id="shaderBtn">shader: manga ▸</button>
<div id="label"><div class="n">GET!!</div></div>
<div id="hud"><div id="hint">slash &nbsp;/&nbsp; tap — feed data to the core</div>
  <div id="bar"><div id="fill"></div></div><button id="again">Again ▶</button></div>
<div id="err"></div>
<div id="perf" class="collapsed">
  <div id="perfBar">FPS <b id="perfFps">–</b> · <span id="perfCalls">–</span> calls · <span id="perfTris">–</span> · <span id="perfQ">–</span> · <span id="perfArrow">▸ perf</span></div>
  <div id="perfBody"></div>
</div>

`;
