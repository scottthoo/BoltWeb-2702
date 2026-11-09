/*
 * Builds the kids' games into public/kid-game/<slug>/, which the site serves at
 * bolt-interactive.com/kid-game/<slug>/. The hub that lists them is
 * public/kid-game/index.html (hand-written, not generated).
 *
 *   npm run kid-games                    # every game
 *   npm run kid-games -- times-strike    # only the named slugs
 *
 * Each game lives in its own repo beside this one (../<repo>), and this script
 * never edits those repos. Vite games are built with the repo's own npm script,
 * pointed at the sub-path and at an output folder here; single-file games run
 * their own build script with --out pointed here; plain HTML games are copied. The output is committed, because Netlify only checks out this repo:
 * change a game in its own repo, then run this again and commit the result.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = fileURLToPath(new URL("..", import.meta.url));
const REPOS = dirname(SITE.replace(/[\\/]$/, "")); // the folder holding this repo and the game repos
const OUT = join(SITE, "public", "kid-game");

const GAMES = [
  // Plain HTML, CSS and JS with no build step: copied, plus a <base> tag (see copyStatic).
  { slug: "make-ten-adventure", repo: "make_ten", copy: ["index.html", "app.jsx", "styles.css"] },
  { slug: "make-ten-and-friends", repo: "make-ten-phaser", copy: ["index.html", "shared", "games"] },
  // Vite projects, built with the repo's own build script.
  { slug: "make-ten-ninja", repo: "game-jam", build: "build" },
  { slug: "ninja-math-dojo", repo: "kid-math-three-js", build: "build" },
  { slug: "ninja-math-worlds", repo: "kid-game-3d-math", build: "build" },
  { slug: "do-not-touch", repo: "kid-game-do-not-touch", build: "build" },
  // The full Times Strike app needs a server; build:standalone is its client-only build.
  { slug: "times-strike", repo: "times-strike", build: "build:standalone" },
  // One self-contained HTML file, written by the repo's own build script.
  { slug: "abc-quickdraw", repo: "abcdef_g", singleFile: "build.mjs" },
];

const basePath = (slug) => `/kid-game/${slug}/`;

function requireInstalled(game, src) {
  if (!existsSync(join(src, "node_modules"))) {
    throw new Error(`${game.repo} has no node_modules: run "npm install" in ${src} first`);
  }
}

function buildVite(game, src, dest) {
  requireInstalled(game, src);
  const args = ["run", game.build, "--", "--base", basePath(game.slug), "--outDir", dest, "--emptyOutDir"];
  const run = spawnSync("npm", args, { cwd: src, stdio: "inherit" });
  if (run.status !== 0) throw new Error(`${game.repo}: "npm ${args.join(" ")}" failed`);
}

// The page inlines everything (code, styles, icon), so its path does not matter.
function buildSingleFile(game, src, dest) {
  requireInstalled(game, src);
  rmSync(dest, { recursive: true, force: true });
  const args = [game.singleFile, "--out", join(dest, "index.html")];
  const run = spawnSync("node", args, { cwd: src, stdio: "inherit" });
  if (run.status !== 0) throw new Error(`${game.repo}: "node ${args.join(" ")}" failed`);
}

// A copied page keeps its relative links (styles.css, ../../shared/...), which
// would resolve against the wrong folder if the page is opened without a
// trailing slash. A <base> tag pins every page to its own folder.
function copyStatic(game, src, dest) {
  rmSync(dest, { recursive: true, force: true });
  for (const entry of game.copy) cpSync(join(src, entry), join(dest, entry), { recursive: true });
  for (const file of listFiles(dest).filter((f) => f.endsWith(".html"))) {
    const folder = relative(dest, dirname(file)).split(sep).filter(Boolean);
    const href = basePath(game.slug) + folder.map((part) => `${part}/`).join("");
    const html = readFileSync(file, "utf8");
    // Right after <meta charset> when there is one (it must stay first), else after <head>.
    const anchor = /<meta\s+charset=[^>]*>/i.test(html) ? /<meta\s+charset=[^>]*>/i : /<head[^>]*>/i;
    if (!anchor.test(html)) throw new Error(`${file} has no <head> to put a <base> in`);
    writeFileSync(file, html.replace(anchor, (tag) => `${tag}\n<base href="${href}" />`));
  }
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

const wanted = process.argv.slice(2);
const unknown = wanted.filter((slug) => !GAMES.some((game) => game.slug === slug));
if (unknown.length) {
  console.error(`Unknown game: ${unknown.join(", ")}. Known: ${GAMES.map((g) => g.slug).join(", ")}`);
  process.exit(1);
}

for (const game of GAMES.filter((g) => !wanted.length || wanted.includes(g.slug))) {
  const src = join(REPOS, game.repo);
  const dest = join(OUT, game.slug);
  if (!existsSync(src)) throw new Error(`${game.slug}: source repo not found at ${src}`);
  console.log(`\n▶ ${game.slug}  (from ../${game.repo})`);
  if (game.build) buildVite(game, src, dest);
  else if (game.singleFile) buildSingleFile(game, src, dest);
  else copyStatic(game, src, dest);
  if (!existsSync(join(dest, "index.html"))) throw new Error(`${game.slug}: no index.html in ${dest}`);
}

console.log(`\nDone. Games are in ${relative(SITE, OUT)}/; the hub is ${relative(SITE, join(OUT, "index.html"))}.`);
