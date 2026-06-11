/**
 * One-off, author-time generator for the social share cards.
 *
 * Renders 1200x630 branded cards (og-image.png + cv-og.png) to /public using the
 * puppeteer/Chrome already pulled in by react-snap. NOT part of the deploy build, so
 * CI/Docker stay Chrome-free. Re-run manually after editing the design or the avatar:
 *
 *   node scripts/og-image.cjs
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const puppeteer = require("puppeteer");

function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  for (const p of candidates) {
    try {
      execSync(`test -x "${p}"`, { stdio: "ignore" });
      return p;
    } catch (_) {}
  }
  return undefined;
}

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const avatarPath = path.join(root, "src/assets/profile/avatar.webp");
const avatarDataUri =
  "data:image/webp;base64," + fs.readFileSync(avatarPath).toString("base64");

// Embed Poppins (from @fontsource) so rendering is deterministic and offline.
const fontDir = path.join(root, "node_modules/@fontsource/poppins/files");
const fontFace = (weight) => {
  const data = fs
    .readFileSync(path.join(fontDir, `poppins-latin-${weight}-normal.woff2`))
    .toString("base64");
  return `@font-face{font-family:'Poppins';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};
const fontFaces = [400, 500, 600, 700].map(fontFace).join("");

// Brand tokens mirrored from src/index.css (light theme).
const SURFACE = "#f3f1e9";
const TEXT = "#333332";
const MUTED = "#7c7a73";
const ACCENT = "#646cff";
const SURROUND = "#4c4b4c";

function card({ eyebrow, title, subtitle, tags }) {
  return `<!doctype html><html><head><meta charset="utf-8" />
  <style>
    ${fontFaces}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1200px; height: 630px; }
    body {
      font-family: 'Poppins', Helvetica, Arial, sans-serif;
      background: ${SURFACE};
      color: ${TEXT};
      display: flex;
      align-items: center;
      gap: 72px;
      padding: 90px 96px;
      position: relative;
      overflow: hidden;
    }
    body::after {
      content: "";
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 14px;
      background: ${ACCENT};
    }
    .photo {
      width: 360px; height: 360px;
      flex: 0 0 360px;
      border-radius: 32px;
      object-fit: cover;
      box-shadow: 0 24px 60px -18px rgba(0,0,0,0.45);
    }
    .col { display: flex; flex-direction: column; min-width: 0; }
    .eyebrow {
      font-size: 30px; font-weight: 600; letter-spacing: 6px;
      text-transform: uppercase; color: ${ACCENT}; margin-bottom: 18px;
    }
    .title { font-size: 92px; font-weight: 700; line-height: 1.02; }
    .subtitle {
      font-size: 44px; font-weight: 500; color: ${SURROUND};
      margin-top: 14px;
    }
    .tags {
      font-size: 30px; font-weight: 500; color: ${MUTED};
      margin-top: 34px; letter-spacing: 1px;
    }
    .url {
      font-size: 30px; font-weight: 600; color: ${ACCENT};
      margin-top: 40px;
    }
  </style></head>
  <body>
    <img class="photo" src="${avatarDataUri}" alt="" />
    <div class="col">
      ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      <div class="url">profile.mitya.dev</div>
    </div>
  </body></html>`;
}

const cards = [
  {
    file: "og-image.png",
    html: card({
      title: "Mitya Kurs",
      subtitle: "Senior Engineering Leader & Hands-On Builder",
      tags: "React · Node.js · AWS · AI",
    }),
  },
  {
    file: "cv-og.png",
    html: card({
      eyebrow: "Curriculum Vitae",
      title: "Mitya Kurs",
      subtitle: "Senior Engineering Leader",
      tags: "14 years shipping production systems",
    }),
  },
];

(async () => {
  const executablePath = findChrome();
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  for (const { file, html } of cards) {
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    // Give embedded fonts/image a beat to paint before snapshotting.
    await new Promise((r) => setTimeout(r, 300));
    const out = path.join(publicDir, file);
    await page.screenshot({ path: out, type: "png" });
    console.log("wrote", out);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
