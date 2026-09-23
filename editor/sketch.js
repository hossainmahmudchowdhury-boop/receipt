// RECEIPT!
// This is the file to edit. p5.js reference: https://p5js.org/reference/
// RECEIPT!
// This is the file to edit. p5.js reference: https://p5js.org/reference/
export const receipt = {
  height: 1080, // 240–2000 px. Width is fixed at 384 by the printer.
  seed: 67,
};

export function drawReceipt(p) {
  p.pixelDensity(1);
  p.randomSeed(receipt.seed);
  p.noiseSeed(receipt.seed);
  p.background(255);
  p.stroke(0);
  p.noFill();

  const w = p.width;
  const h = p.height;

  const skyBottom = h * 0.34;
  const mountainBand = h * 0.4;
  const fieldBottom = h * 0.52;
  const waterBottom = h * 0.78;
  const bankTop = waterBottom;

  drawSky(p, w, skyBottom);
  drawMountains(p, w, mountainBand, skyBottom);
  drawFields(p, w, fieldBottom, mountainBand);
  drawWater(p, w, waterBottom, fieldBottom);
  drawBoats(p, w, fieldBottom, waterBottom);
  drawBank(p, w, h, bankTop);
  drawPosts(p, w, h, bankTop);
}

// Overcast sky: soft hatched cloud clumps
function drawSky(p, w, bottom) {
  p.noStroke();
  p.fill(0);
  for (let i = 0; i < 900; i += 1) {
    const x = p.random(w);
    const y = p.random(bottom);
    const n = p.noise(x * 0.012, y * 0.02, 4);
    if (n > 0.58) {
      const size = p.map(n, 0.58, 1, 0.5, 1.6);
      p.circle(x, y, size);
    }
  }
  // a stray wire cutting across the sky
  p.stroke(0);
  p.strokeWeight(1);
  p.line(0, bottom * 0.08, w, bottom * 0.28);
}

// Distant hazy mountain range, layered and faint via sparse hatching
function drawMountains(p, w, bandY, skyBottom) {
  const baseline = bandY;
  const points = [];
  for (let x = 0; x <= w; x += 4) {
    const ridge =
      p.noise(x * 0.01, 12) * 40 + p.noise(x * 0.03, 40) * 14;
    points.push({ x, y: baseline - ridge });
  }

  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  p.beginShape();
  points.forEach((pt) => p.vertex(pt.x, pt.y));
  p.endShape();

  // sparse stipple beneath the ridge line to suggest atmospheric haze
  p.noStroke();
  p.fill(0);
  for (let i = 0; i < 260; i += 1) {
    const x = p.random(w);
    const idx = Math.min(points.length - 1, Math.floor(x / 4));
    const topY = points[idx].y;
    const y = p.random(topY, baseline + 6);
    if (p.noise(x * 0.02, y * 0.02, 77) > 0.6) p.circle(x, y, 0.9);
  }
}

// Flat green paddy fields as a horizontal band, with a small hut silhouette
function drawFields(p, w, bottom, top) {
  p.stroke(0);
  p.strokeWeight(1);
  for (let y = top + 6; y < bottom; y += 3) {
    const jitter = p.noise(y * 0.1, 5) * 2;
    p.line(0, y + jitter, w, y + jitter);
  }
  // a small hut on the horizon
  const hx = w * 0.42;
  const hy = top + (bottom - top) * 0.4;
  p.noFill();
  p.strokeWeight(1.2);
  p.rect(hx, hy, 14, 8);
  p.triangle(hx - 2, hy, hx + 7, hy - 6, hx + 16, hy);

  // the raised earthen embankment running toward the boats
  p.strokeWeight(2);
  p.line(w * 0.1, bottom - 2, w * 0.95, bottom + 8);
  p.strokeWeight(1);
  for (let x = w * 0.1; x < w * 0.95; x += 6) {
    p.point(x, bottom - 2 + ((x - w * 0.1) / (w * 0.85)) * 10);
  }
}

// Open water with light ripple hatching
function drawWater(p, w, bottom, top) {
  p.stroke(0);
  for (let y = top; y < bottom; y += 5) {
    p.strokeWeight(p.random(0.4, 1));
    let x = 0;
    while (x < w) {
      const len = p.random(6, 22);
      if (p.noise(x * 0.02, y * 0.05, 8) > 0.42) {
        p.line(x, y, x + len, y);
      }
      x += len + p.random(3, 10);
    }
  }
}

// Cluster of moored wooden boats, hulls only, drawn as simple angular forms
function drawBoats(p, w, fieldBottom, waterBottom) {
  const baseY = fieldBottom + (waterBottom - fieldBottom) * 0.35;
  const boatData = [
    { x: w * 0.42, len: 70, tilt: -6 },
    { x: w * 0.55, len: 82, tilt: -3 },
    { x: w * 0.68, len: 64, tilt: 4 },
  ];

  boatData.forEach((b, i) => {
    p.push();
    p.translate(b.x, baseY + i * 6);
    p.rotate(p.radians(b.tilt));
    drawHull(p, b.len);
    p.pop();
  });
}

function drawHull(p, len) {
  const half = len / 2;
  p.stroke(0);
  p.strokeWeight(1.5);
  p.noFill();
  p.beginShape();
  p.vertex(-half, 6);
  p.vertex(-half - 6, -6);
  p.vertex(-half + 4, -10);
  p.vertex(half - 4, -10);
  p.vertex(half + 6, -6);
  p.vertex(half, 6);
  p.vertex(-half, 6);
  p.endShape();
  // waterline hatch under hull
  p.strokeWeight(1);
  for (let x = -half; x < half; x += 4) {
    p.line(x, 6, x + 2, 8);
  }
  // small raised bow post
  p.line(half + 6, -6, half + 8, -14);
}

// Muddy bank / road foreground with a lane marking
function drawBank(p, w, h, top) {
  p.noStroke();
  p.fill(0);
  const roadTop = h * 0.9;

  // bank: cross-hatched earth texture
  for (let y = top; y < roadTop; y += 3) {
    p.stroke(0);
    p.strokeWeight(0.6);
    for (let x = 0; x < w; x += p.random(5, 11)) {
      if (p.noise(x * 0.03, y * 0.05, 3) > 0.45) {
        p.line(x, y, x + 4, y + 2);
      }
    }
  }

  // road strip
  p.stroke(0);
  p.strokeWeight(1.5);
  p.line(0, roadTop, w, roadTop);
  p.strokeWeight(3);
  p.line(0, h - 4, w, h - 4);

  // dashed lane marking
  for (let x = 0; x < w; x += 16) {
    p.strokeWeight(2);
    p.line(x, (roadTop + h - 4) / 2, x + 8, (roadTop + h - 4) / 2);
  }
}

// Red-and-white striped roadside marker posts, drawn in foreground perspective
function drawPosts(p, w, h, bankTop) {
  const posts = [
    { x: w * 0.14, pw: 26, ph: h * 0.38 },
    { x: w * 0.46, pw: 20, ph: h * 0.3 },
    { x: w * 0.86, pw: 24, ph: h * 0.34 },
  ];

  posts.forEach((post) => {
    const top = h - post.ph - 30;
    const bottom = h - 30;
    const stripes = 6;
    const stripeH = (bottom - top) / stripes;

    p.stroke(0);
    p.strokeWeight(1.5);
    p.noFill();
    p.rect(post.x - post.pw / 2, top, post.pw, bottom - top);

    for (let i = 0; i < stripes; i += 1) {
      if (i % 2 === 1) {
        p.noStroke();
        p.fill(0);
        p.rect(post.x - post.pw / 2, top + i * stripeH, post.pw, stripeH);
      }
    }
    p.noFill();
    p.stroke(0);
  });
}
