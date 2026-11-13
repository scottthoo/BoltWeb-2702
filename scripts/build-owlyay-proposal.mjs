/*
 * Builds the Owlyay parent & school proposal deck into public/owlyay/proposal/,
 * which the site serves at bolt-interactive.com/owlyay/proposal (beside the
 * Owlyay landing page and privacy policy).
 *
 *   npm run owlyay-proposal          # rebuild index.html
 *   npm run owlyay-proposal -- --og  # also re-capture og.jpg (slide 1) with local Chrome
 *
 * The deck lives in the screen-owl repo beside this one
 * (../screen-owl/docs/proposal/owlyay_parent_school_presentation.html), and this
 * script never edits it. The source loads Three.js r170 from jsDelivr and its
 * fonts from Google Fonts; the page written here carries both inside it, so it
 * loads nothing from anywhere, and it gains the link-preview tags. The output is
 * committed, because Netlify only checks out this repo: change the deck in
 * screen-owl, then run this again and commit the result.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const SITE = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(dirname(SITE.replace(/[\\/]$/, "")), "screen-owl", "docs", "proposal", "owlyay_parent_school_presentation.html");
const PAGE = "owlyay/proposal";
const URL_BASE = `https://bolt-interactive.com/${PAGE}`;
const OUT_DIR = join(SITE, "public", ...PAGE.split("/"));
const OUT = join(OUT_DIR, "index.html");
const OG = join(OUT_DIR, "og.jpg");
const require = createRequire(import.meta.url);

/**
 * Replaces exactly one match of `pattern` in `html`, or stops the build. A string
 * replacement is inserted as-is (no `$` patterns: bundled code is full of them);
 * a function gets the match.
 */
function replaceOnce(html, pattern, replacement, what) {
  const hits = html.match(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"));
  if (!hits || hits.length !== 1) throw new Error(`expected exactly one ${what} in the deck, found ${hits ? hits.length : 0}`);
  return html.replace(pattern, typeof replacement === "function" ? replacement : () => replacement);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/* Fredoka and Nunito, latin subset, as the variable fonts Google Fonts serves for this deck. */
function fontFaces() {
  const face = (pkg, file, family, weights) => {
    const dir = dirname(require.resolve(`${pkg}/package.json`));
    const css = readFileSync(join(dir, "wght.css"), "utf8");
    const block = css.split("@font-face").find((b) => b.includes(`/files/${file}`));
    const range = block && /unicode-range:\s*([^;]+);/.exec(block);
    if (!range) throw new Error(`${pkg}: no @font-face for ${file}`);
    const data = readFileSync(join(dir, "files", file)).toString("base64");
    return [
      `  /* ${family} (${pkg}), latin */`,
      "  @font-face {",
      `    font-family: '${family}';`,
      "    font-style: normal;",
      `    font-weight: ${weights};`,
      "    font-display: swap;",
      `    src: url(data:font/woff2;base64,${data}) format('woff2');`,
      `    unicode-range: ${range[1].trim()};`,
      "  }",
    ].join("\n");
  };
  return [
    "/* The fonts, inside the file: it loads nothing from anywhere. */",
    face("@fontsource-variable/fredoka", "fredoka-latin-wght-normal.woff2", "Fredoka", "300 700"),
    face("@fontsource-variable/nunito", "nunito-latin-wght-normal.woff2", "Nunito", "200 1000"),
  ].join("\n");
}

/* The 3D layer, bundled with Three.js r170 (the version the deck was written for) and its addons. */
async function bundle3d(code) {
  const result = await build({
    stdin: { contents: code, resolveDir: SITE, sourcefile: "owlyay-deck-3d.js", loader: "js" },
    bundle: true,
    format: "esm",
    // es2022 for the module's top-level await (it waits for Fredoka before drawing text).
    target: "es2022",
    minify: true,
    write: false,
    metafile: true,
    legalComments: "eof",
    alias: { three: "three-r170" },
    logLevel: "warning",
  });
  const stray = Object.keys(result.metafile.inputs).filter((p) => p.includes("node_modules/") && !p.includes("node_modules/three-r170/"));
  if (stray.length) throw new Error(`the 3D bundle pulled in code outside three-r170: ${stray.join(", ")}`);
  const js = result.outputFiles[0].text;
  if (/<\/script/i.test(js)) throw new Error("the 3D bundle contains </script and cannot be inlined");
  return js.trim();
}

function headTags(html) {
  const title = unesc(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "");
  const description = unesc(/<meta name="description" content="([^"]*)">/.exec(html)?.[1] ?? "");
  if (!title || !description) throw new Error("the deck needs a <title> and a meta description");
  const imageAlt = "Owlyay: make screen time work harder.";
  return [
    `<meta name="theme-color" content="#F2E8D7">`,
    `<link rel="canonical" href="${URL_BASE}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Bolt Interactive">`,
    `<meta property="og:url" content="${URL_BASE}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${URL_BASE}/og.jpg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${URL_BASE}/og.jpg">`,
  ].join("\n");
}

/*
 * Slide 1 at the size link previews use, rendered by the local Chrome over the
 * DevTools protocol. It waits in real time: Chrome's --screenshot with a virtual
 * time budget catches the 3D scene and the text half-way through animating in.
 */
async function captureOg() {
  const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (!existsSync(chrome)) throw new Error(`Chrome not found at ${chrome}; set CHROME to its binary`);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const profile = mkdtempSync(join(tmpdir(), "owlyay-og-"));
  const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  try {
    const portFile = join(profile, "DevToolsActivePort");
    for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
    const port = existsSync(portFile) && readFileSync(portFile, "utf8").split("\n")[0];
    if (!port) throw new Error("Chrome did not open a DevTools port");
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let nextId = 0;
    const waiting = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (!waiting.has(msg.id)) return;
      const { resolve, reject } = waiting.get(msg.id);
      waiting.delete(msg.id);
      if (msg.error) reject(new Error(`DevTools: ${msg.error.message}`));
      else resolve(msg.result);
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++nextId;
      waiting.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
    await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `${pathToFileURL(OUT).href}#1` });
    await sleep(6000); // fonts, the 3D scene's fade-in and the hero's rise animations
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
    writeFileSync(OG, Buffer.from(data, "base64"));
    ws.close();
  } finally {
    proc.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }
}

const html0 = readFileSync(SRC, "utf8");
let html = html0;

// Google Fonts: the two preconnects and the stylesheet go; the fonts move inside the <style>.
html = replaceOnce(html, /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n/, "", "fonts.googleapis.com preconnect");
html = replaceOnce(html, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n/, "", "fonts.gstatic.com preconnect");
html = replaceOnce(html, /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet">\n/, "", "Google Fonts stylesheet");
html = replaceOnce(html, /<style>\n/, `<style>\n${fontFaces()}\n`, "<style>");

// Link previews, after the description.
html = replaceOnce(html, /<meta name="description" content="[^"]*">\n/, (tag) => `${tag}${headTags(html0)}\n`, "meta description");

// Three.js from jsDelivr: the import map goes, and the 3D module is bundled in its place.
html = replaceOnce(html, /<script type="importmap">[\s\S]*?<\/script>\n/, "", "import map");
const moduleRe = /<script type="module">\n([\s\S]*?)<\/script>/;
const moduleCode = moduleRe.exec(html)?.[1];
if (!moduleCode) throw new Error("no <script type=\"module\"> in the deck");
const js = await bundle3d(moduleCode);
html = replaceOnce(html, moduleRe, `<script type="module">\n/* The 3D layer and Three.js r170 (MIT), bundled from the deck's module script. */\n${js}\n</script>`, "module script");

// The canonical link names this page; it is not something the page loads.
const remote = html.replace(/<link rel="canonical" [^>]*>/, "").match(/(?:src|href)="https?:\/\/[^"]*"|url\(\s*["']?https?:\/\/[^)]*\)|from\s*["']https?:\/\/[^"']*["']/g) || [];
if (remote.length) throw new Error(`the page still loads from elsewhere: ${remote.join(", ")}`);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, html);
console.log(`wrote ${relative(SITE, OUT)} (${Math.round(Buffer.byteLength(html) / 1024)} KB) from ${relative(SITE, SRC)}`);

if (process.argv.includes("--og")) {
  await captureOg();
  console.log(`wrote ${relative(SITE, OG)}`);
} else if (!existsSync(OG)) {
  console.warn(`${relative(SITE, OG)} is missing: run "npm run owlyay-proposal -- --og" to capture it`);
}
