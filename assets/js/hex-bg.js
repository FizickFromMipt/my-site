(function () {
  const canvas = document.getElementById("hexBg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, edges, trails, lastTime;

  const HEX_RADIUS = 55;
  const LINE_COLOR = "rgba(255,255,255,0.025)";
  const TRAIL_COUNT = 5;
  const TRAIL_LENGTH = 25;

  const TRAIL_COLORS = [
    [74, 123, 247],
    [0, 212, 255],
    [120, 80, 220],
    [0, 200, 180],
    [90, 100, 240],
  ];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildGrid();
    initTrails();
  }

  // Flat-top hex corner
  function hexCorner(cx, cy, r, i) {
    const angle = (Math.PI / 180) * (60 * i);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function buildGrid() {
    edges = [];
    const edgeSet = new Set();
    const w = HEX_RADIUS * 2;
    const h = Math.sqrt(3) * HEX_RADIUS;
    const cols = Math.ceil(W / (w * 0.75)) + 2;
    const rows = Math.ceil(H / h) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * w * 0.75;
        const cy = row * h + (col % 2 === 0 ? 0 : h / 2);

        for (let i = 0; i < 6; i++) {
          const [x1, y1] = hexCorner(cx, cy, HEX_RADIUS, i);
          const [x2, y2] = hexCorner(cx, cy, HEX_RADIUS, (i + 1) % 6);

          const key = Math.round(x1) + "," + Math.round(y1) + "-" + Math.round(x2) + "," + Math.round(y2);
          const keyRev = Math.round(x2) + "," + Math.round(y2) + "-" + Math.round(x1) + "," + Math.round(y1);

          if (!edgeSet.has(key) && !edgeSet.has(keyRev)) {
            edgeSet.add(key);
            edges.push({ x1, y1, x2, y2 });
          }
        }
      }
    }

    // Build adjacency
    edges.forEach((e, idx) => { e.idx = idx; });

    const pointMap = {};
    function pk(x, y) { return Math.round(x) + "," + Math.round(y); }

    edges.forEach((e) => {
      const k1 = pk(e.x1, e.y1);
      const k2 = pk(e.x2, e.y2);
      if (!pointMap[k1]) pointMap[k1] = [];
      if (!pointMap[k2]) pointMap[k2] = [];
      pointMap[k1].push(e);
      pointMap[k2].push(e);
    });

    edges.forEach((e) => {
      const k1 = pk(e.x1, e.y1);
      const k2 = pk(e.x2, e.y2);
      const neighbors = new Set();
      (pointMap[k1] || []).forEach((n) => { if (n.idx !== e.idx) neighbors.add(n.idx); });
      (pointMap[k2] || []).forEach((n) => { if (n.idx !== e.idx) neighbors.add(n.idx); });
      e.neighbors = Array.from(neighbors);
    });
  }

  function initTrails() {
    trails = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      trails.push(createTrail(i));
    }
  }

  function createTrail(colorIdx) {
    const startIdx = Math.floor(Math.random() * edges.length);
    const path = [startIdx];
    let current = startIdx;

    for (let j = 0; j < TRAIL_LENGTH; j++) {
      const e = edges[current];
      if (!e || e.neighbors.length === 0) break;
      const next = e.neighbors[Math.floor(Math.random() * e.neighbors.length)];
      path.push(next);
      current = next;
    }

    return {
      path,
      progress: 0,
      color: TRAIL_COLORS[colorIdx % TRAIL_COLORS.length],
      speed: 0.6 + Math.random() * 0.3,
    };
  }

  function advanceTrail(trail, dt) {
    trail.progress += trail.speed * dt;

    while (trail.progress >= 1) {
      trail.progress -= 1;

      const headIdx = trail.path[trail.path.length - 1];
      const head = edges[headIdx];
      if (head && head.neighbors.length > 0) {
        let candidates = head.neighbors.filter(
          (n) => trail.path.length < 2 || n !== trail.path[trail.path.length - 2]
        );
        if (candidates.length === 0) candidates = head.neighbors;
        trail.path.push(candidates[Math.floor(Math.random() * candidates.length)]);
      }

      if (trail.path.length > TRAIL_LENGTH + 2) {
        trail.path.shift();
      }
    }
  }

  function drawFrame(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    ctx.clearRect(0, 0, W, H);

    // Draw hex grid — dark anthracite lines
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      ctx.moveTo(e.x1, e.y1);
      ctx.lineTo(e.x2, e.y2);
    }
    ctx.stroke();

    // Draw trails with smooth interpolation
    for (let t = 0; t < trails.length; t++) {
      const trail = trails[t];
      advanceTrail(trail, dt);

      const len = trail.path.length;
      const [r, g, b] = trail.color;

      for (let i = 0; i < len; i++) {
        const e = edges[trail.path[i]];
        if (!e) continue;

        // Smooth fade: cubic easing from tail to head
        const ratio = (i + (i === len - 1 ? trail.progress : 1)) / len;
        const alpha = ratio * ratio * 0.85;

        if (alpha < 0.01) continue;

        const glow = 6 + alpha * 14;

        ctx.save();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.6})`;
        ctx.shadowBlur = glow;
        ctx.lineWidth = 1 + alpha * 2;
        ctx.lineCap = "round";
        ctx.beginPath();

        // Smooth: for head edge, draw partial line based on progress
        if (i === len - 1) {
          const px = e.x1 + (e.x2 - e.x1) * trail.progress;
          const py = e.y1 + (e.y2 - e.y1) * trail.progress;
          ctx.moveTo(e.x1, e.y1);
          ctx.lineTo(px, py);
        } else {
          ctx.moveTo(e.x1, e.y1);
          ctx.lineTo(e.x2, e.y2);
        }

        ctx.stroke();
        ctx.restore();
      }
    }

    requestAnimationFrame(drawFrame);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  requestAnimationFrame(drawFrame);
})();
