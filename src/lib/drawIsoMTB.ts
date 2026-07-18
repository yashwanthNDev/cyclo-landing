// ─────────────────────────────────────────────────────────────
// Isometric MTB Bike — standalone canvas drawing utility
// ─────────────────────────────────────────────────────────────

const ISO_ANGLE = Math.PI / 6;

function isoProject(x: number, y: number, z: number) {
  return {
    sx: (x - y) * Math.cos(ISO_ANGLE),
    sy: (x + y) * Math.sin(ISO_ANGLE) - z,
  };
}

export function drawIsoMTB(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  roadAngle: number,
  scale: number,
  wheelRot: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(roadAngle * 0.35);

  const sc = scale;

  const LINE   = "#c8b870";
  const DARK   = "#6a5828";
  const RIM    = "#b09850";
  const RUBBER = "#222218";
  const CHROME = "#d0c890";
  const GOLD   = "#d4b84a";

  function pt(x: number, y: number, z: number) {
    const s = isoProject(x, y, z);
    return { x: s.sx * sc, y: s.sy * sc };
  }

  function ST(col: string, lw: number, fn: () => void) {
    ctx.strokeStyle = col;
    ctx.lineWidth = lw * sc;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    fn();
    ctx.stroke();
  }
  function FL(col: string, fn: () => void) {
    ctx.fillStyle = col;
    ctx.beginPath();
    fn();
    ctx.fill();
  }
  function SFL(strokeCol: string, fillCol: string, lw: number, fn: () => void) {
    ctx.fillStyle = fillCol;
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = lw * sc;
    ctx.beginPath();
    fn();
    ctx.fill();
    ctx.stroke();
  }
  function M(p: { x: number; y: number }) { ctx.moveTo(p.x, p.y); }
  function L(p: { x: number; y: number }) { ctx.lineTo(p.x, p.y); }

  function drawWheel(wx: number, wy: number, wz: number, R: number, rot: number) {
    const STEPS = 60;
    function wpt(a: number) {
      return pt(wx + Math.sin(a) * R, wy, wz + Math.cos(a) * R);
    }
    function wptI(a: number) {
      return pt(wx + Math.sin(a) * (R - 2.5), wy, wz + Math.cos(a) * (R - 2.5));
    }

    ctx.strokeStyle = RUBBER;
    ctx.lineWidth = 5.5 * sc;
    ctx.lineCap = "butt";
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const p = wpt((i / STEPS) * Math.PI * 2);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    for (let k = 0; k < 18; k++) {
      const a = rot + (k / 18) * Math.PI * 2;
      const kp = wpt(a);
      FL(RUBBER, () => { ctx.arc(kp.x, kp.y, 1.5 * sc, 0, Math.PI * 2); });
    }

    ctx.strokeStyle = RIM;
    ctx.lineWidth = 2.2 * sc;
    ctx.lineCap = "butt";
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const p = wpt((i / STEPS) * Math.PI * 2);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = RIM;
    ctx.lineWidth = 0.7 * sc;
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const p = wptI((i / STEPS) * Math.PI * 2);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    const hub = pt(wx, wy, wz);
    for (let s = 0; s < 12; s++) {
      const a = rot + (s / 12) * Math.PI * 2;
      const sp = wptI(a);
      ST(RIM, 0.45, () => { ctx.moveTo(hub.x, hub.y); ctx.lineTo(sp.x, sp.y); });
    }
    for (let s = 0; s < 12; s++) {
      const a1 = rot + (s / 12) * Math.PI * 2;
      const a2 = rot + ((s + 4) / 12) * Math.PI * 2;
      const sp1 = wptI(a1), sp2 = wptI(a2);
      ST(DARK, 0.3, () => { ctx.moveTo(sp1.x, sp1.y); ctx.lineTo(sp2.x, sp2.y); });
    }

    FL(DARK,   () => { ctx.arc(hub.x, hub.y, 3.5 * sc, 0, Math.PI * 2); });
    FL(RIM,    () => { ctx.arc(hub.x, hub.y, 2.0 * sc, 0, Math.PI * 2); });
    FL(RUBBER, () => { ctx.arc(hub.x, hub.y, 0.9 * sc, 0, Math.PI * 2); });

    function discPt(a: number) {
      return pt(wx + Math.sin(a) * 5.5, wy + 1.0, wz + Math.cos(a) * 5.5);
    }
    ctx.strokeStyle = CHROME;
    ctx.lineWidth = 0.9 * sc;
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const p = discPt((i / STEPS) * Math.PI * 2);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
    for (let d = 0; d < 6; d++) {
      const a = rot + (d / 6) * Math.PI * 2;
      FL(CHROME, () => { const dp = discPt(a); ctx.arc(dp.x, dp.y, 0.7 * sc, 0, Math.PI * 2); });
    }
  }

  const RWX = -16, FWX = 16, WZ = 10, WR = 11;

  const pBB = pt(0,   0, 10);
  const pRA = pt(RWX, 0, WZ);
  const pFA = pt(FWX, 0, WZ);
  const pHT = pt(15,  0, 26);
  const pHB = pt(14,  0, 15);
  const pST = pt(-4,  0, 29);

  drawWheel(RWX, 0, WZ, WR, wheelRot);

  ST(LINE, 2.5, () => { M(pBB); L(pRA); });
  ST(LINE, 1.2, () => { M(pt(0, 1.0, 10)); L(pt(RWX, 1.0, WZ)); });
  ST(LINE, 1.7, () => { M(pST); L(pRA); });
  ST(LINE, 0.9, () => { M(pt(-4, 0.8, 29)); L(pt(RWX, 0.8, WZ)); });

  ST(GOLD, 4.0, () => { M(pBB); L(pHB); });
  ST(LINE, 1.1, () => { M(pt(0, 0.7, 10)); L(pt(14, 0.7, 15)); });
  ST(GOLD, 3.2, () => { M(pBB); L(pST); });
  ST(GOLD, 2.5, () => { M(pST); L(pHT); });
  ST(LINE, 0.8, () => { M(pt(-4, 0.5, 29)); L(pt(15, 0.5, 26)); });
  ST(LINE, 4.5, () => { M(pHB); L(pHT); });

  ST(LINE,   2.3, () => { M(pHB); L(pt(FWX, -1.5, WZ + 3)); L(pFA); });
  ST(LINE,   2.3, () => { M(pHB); L(pt(FWX,  1.5, WZ + 3)); L(pt(FWX, 1.5, WZ)); });
  ST(DARK,   1.5, () => { M(pt(FWX, -1.5, WZ + 6)); L(pt(FWX, 1.5, WZ + 6)); });
  ST(CHROME, 2.2, () => { M(pHB); L(pt(FWX, -1.5, WZ + 6)); });
  ST(CHROME, 2.2, () => { M(pHB); L(pt(FWX,  1.5, WZ + 6)); });

  drawWheel(FWX, 0, WZ, WR, wheelRot * 0.97);

  FL(LINE, () => { ctx.arc(pBB.x, pBB.y, 4.5 * sc, 0, Math.PI * 2); });
  FL(DARK, () => { ctx.arc(pBB.x, pBB.y, 2.5 * sc, 0, Math.PI * 2); });

  const crSteps = 36;
  function cringOuter(a: number) { return pt(Math.sin(a) * 8,   0, 10 + Math.cos(a) * 8); }
  function cringInner(a: number) { return pt(Math.sin(a) * 5.5, 0, 10 + Math.cos(a) * 5.5); }

  ctx.strokeStyle = CHROME; ctx.lineWidth = 1.5 * sc;
  ctx.beginPath();
  for (let i = 0; i <= crSteps; i++) {
    const p = cringOuter((i / crSteps) * Math.PI * 2);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath(); ctx.stroke();

  ctx.strokeStyle = CHROME; ctx.lineWidth = 0.6 * sc;
  ctx.beginPath();
  for (let i = 0; i <= crSteps; i++) {
    const p = cringInner((i / crSteps) * Math.PI * 2);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath(); ctx.stroke();

  for (let s = 0; s < 5; s++) {
    const a = (s / 5) * Math.PI * 2 + wheelRot;
    ST(DARK, 0.6, () => { M(pBB); L(cringInner(a)); });
  }

  const crankR = 11;
  const c1x = Math.sin(wheelRot) * crankR,           c1z = 10 + Math.cos(wheelRot) * crankR;
  const c2x = Math.sin(wheelRot + Math.PI) * crankR, c2z = 10 + Math.cos(wheelRot + Math.PI) * crankR;
  const pc1 = pt(c1x, 0, c1z), pc2 = pt(c2x, 0, c2z);

  ST(LINE, 3.0, () => { M(pBB); L(pc1); });
  ST(LINE, 3.0, () => { M(pBB); L(pc2); });

  function drawPedal(px: number, pz: number) {
    const p1 = pt(px - 1.5, -2.5, pz), p2 = pt(px - 1.5, 2.5, pz);
    const p3 = pt(px + 1.5,  2.5, pz), p4 = pt(px + 1.5, -2.5, pz);
    SFL(CHROME, RUBBER, 0.6, () => { M(p1); L(p2); L(p3); L(p4); ctx.closePath(); });
    for (let pin = 0; pin < 3; pin++) {
      const pp = pt(px, -1.5 + pin * 1.5, pz);
      ST(CHROME, 0.4, () => { ctx.arc(pp.x, pp.y, 0.5 * sc, 0, Math.PI * 2); });
    }
  }
  drawPedal(c1x, c1z);
  drawPedal(c2x, c2z);

  const pSeatPost = pt(-4, 0, 37);
  ST(CHROME, 1.9, () => { M(pST); L(pSeatPost); });

  const s1  = pt(-10,  0,   37.5), s2  = pt( 3,  0,   37.5);
  const s1b = pt(-10,  2,   36.8), s2b = pt( 3,  2,   36.8);
  const s1d = pt(-10, -2,   36.8), s2d = pt( 3, -2,   36.8);
  SFL(DARK, RUBBER,    0.6, () => { M(s1); L(s2); L(s2b); L(s1b); ctx.closePath(); });
  SFL(DARK, "#1a1a14", 0.4, () => { M(s1); L(s2); L(s2d); L(s1d); ctx.closePath(); });
  ST(CHROME, 0.6, () => { M(s1b); L(s2b); });

  const pStemTop = pt(16, 0, 29);
  const pStemFwd = pt(18, 0, 30);
  ST(CHROME, 2.2, () => { M(pHT); L(pStemTop); L(pStemFwd); });
  FL(DARK, () => { ctx.arc(pStemFwd.x, pStemFwd.y, 2.2 * sc, 0, Math.PI * 2); });

  const bL  = pt(17, -11, 30.5);
  const bML = pt(17,  -5, 30.2);
  const bC  = pt(18,   0, 30.0);
  const bMR = pt(17,   5, 30.2);
  const bR  = pt(17,  11, 30.5);
  ST(CHROME, 2.4, () => { M(bL); L(bML); L(bC); L(bMR); L(bR); });

  ST(RUBBER, 5.0, () => { M(pt(17, -8,  30.3)); L(pt(17, -12, 30.6)); });
  ST(RUBBER, 5.0, () => { M(pt(17,  8,  30.3)); L(pt(17,  12, 30.6)); });

  ST(CHROME, 1.6, () => { M(pt(17, -9, 30.4)); L(pt(15, -11, 27)); });
  ST(CHROME, 1.6, () => { M(pt(17,  9, 30.4)); L(pt(15,  11, 27)); });

  ST(DARK, 0.5, () => { M(pt(15, -11, 27)); L(pt(15, 0, 26)); });
  ST(DARK, 0.5, () => { M(pt(15,  11, 27)); L(pt(15, 0, 26)); });

  SFL("#2a4f70", "#3a6090", 0.5, () => { M(pt(3,0.8,12)); L(pt(3,0.8,19)); L(pt(6,0.8,19)); L(pt(6,0.8,12)); ctx.closePath(); });
  SFL("#1e3d58", "#2a5070", 0.4, () => { M(pt(3,0.8,12)); L(pt(3,2.2,12)); L(pt(6,2.2,12)); L(pt(6,0.8,12)); ctx.closePath(); });
  SFL("#1e3d58", "#2a5070", 0.4, () => { M(pt(3,0.8,19)); L(pt(3,2.2,19)); L(pt(6,2.2,19)); L(pt(6,0.8,19)); ctx.closePath(); });
  SFL("#2a4f70", "#3a6090", 0.4, () => { M(pt(3,2.2,12)); L(pt(3,2.2,19)); L(pt(6,2.2,19)); L(pt(6,2.2,12)); ctx.closePath(); });

  ctx.restore();
}
