#!/usr/bin/env node
// Renders every extension card in images/ in one style: the extension's block colour,
// a faded Lucide icon, the title in Poppins Bold and an italic tagline. 600x300 PNG.
// Uses the locally installed Google Chrome in headless mode; icons come from lucide-static.
//   node scripts/generate-images.mjs            all cards
//   node scripts/generate-images.mjs Timing     just one

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// file name (images/<name>.png): [block colour, lucide icon, title, tagline]
const CARDS = {
  "Async Skins": ["#ff69b4", "image", "Async Skins", "Load and manage skins without waiting"],
  Canvas: ["#4A893D", "brush", "Canvas", "Render like never before :D"],
  Databases: ["#ab1922", "database", "Databases", "Tables & SQL in your project"],
  DiscordBot: ["#7289DA", "bot", "Discord Bot", "Create Discord bots easily"],
  EvalPlus: ["#795595", "code", "EvalPlus", "Restricted evaluation of JS, and enable/disable all eval"],
  Github: ["#6cc644", "github", "GitHub", "Read and write to your GitHub repos"],
  HTMLInputs: ["#f06529", "text-cursor-input", "HTML Inputs", "Simple and easy HTML input system"],
  "Iframe+": ["#333d82", "app-window", "Iframe+", "The most powerful iframe Scratch extension"],
  IndexedDB: ["#C65B5B", "hard-drive", "IndexedDB", "Store massive amounts of data locally and easily"],
  KeyHistory: ["#36644E", "keyboard", "Key History", "Never miss a keypress again"],
  MediaUtils: ["#FF66C4", "webcam", "Media Utils", "Display the user's media devices and check permissions"],
  "Mist's Utils": ["#2DA4A0", "wrench", "Mist's Utils", "Super fast blocks! 2x faster than text and lms toolbox"],
  MistFetch: ["#6fa6eb", "cloud-download", "MistFetch", "Download with more control"],
  OASM: ["#101010", "cpu", "OASM", "Effortlessly run OASM in any project"],
  "Persistent File System": ["#4a90e2", "folder", "Persistent Files", "Store and modify a persistent file system"],
  Python: ["#b58707", "terminal", "Python", "Run Python code, isn't that epic :D"],
  RDF: ["#4C97FF", "braces", "RDF", "Type enforced, constrained key-value storage"],
  Rotur: ["#403041", "sparkles", "Rotur", "Utilise rotur in your projects"],
  roturVoice: ["#db76c0", "phone", "roturVoice", "A simple extension for voice calls over PeerJS"],
  Shaders: ["#3f87ff", "blend", "Shaders", "Run GLSL and use shader output as costumes"],
  Tables: ["#ab1922", "table", "Tables", "Legacy compiled 2d arrays"],
  Timing: ["#3d7fe8", "timer", "Timing", "Waits, timers & cooldowns"],
  "Virtual File System": ["#4a90e2", "folder-open", "Virtual Files", "Store and modify an in-memory file system"],
  WebsocketPlus: ["#FF5722", "plug-zap", "WebSocket+", "Handle unlimited websocket connections at once"],
};

const escapeHTML = (text) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function icon(name) {
  const response = await fetch(`https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`);
  if (!response.ok) throw new Error(`no lucide icon called "${name}"`);
  return (await response.text()).replace(/<!--[\s\S]*?-->/g, "");
}

const page = (color, svg, title, tagline) => `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,700;1,700&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; width: 600px; height: 300px; overflow: hidden; }
  body { background: ${color}; font-family: Poppins, sans-serif; color: #fff; position: relative; }
  .icon { position: absolute; left: 50%; top: 15px; height: 270px; transform: translateX(-50%); opacity: 0.4; }
  .icon svg { height: 100%; width: auto; }
  .title { position: absolute; left: 0; right: 0; top: 162px; transform: translateY(-50%);
           text-align: center; font-weight: 700; line-height: 1; white-space: nowrap; }
  .tagline { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
             font-weight: 700; font-style: italic; white-space: nowrap; }
</style></head>
<body>
  <div class="icon">${svg}</div>
  <div class="title"><span>${escapeHTML(title)}</span></div>
  <div class="tagline"><span>${escapeHTML(tagline)}</span></div>
  <script>
    // largest size that fits, capped so short titles don't dwarf the card
    const fit = (el, max, width) => {
      let size = max;
      el.style.fontSize = size + "px";
      while (el.firstElementChild.getBoundingClientRect().width > width && size > 8) el.style.fontSize = --size + "px";
    };
    document.fonts.ready.then(() => {
      fit(document.querySelector(".title"), 96, 470);
      fit(document.querySelector(".tagline"), 18, 560);
    });
  </script>
</body></html>`;

const only = process.argv.slice(2);
const names = only.length ? only : Object.keys(CARDS);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ext-images-"));

for (const name of names) {
  if (!CARDS[name]) throw new Error(`no card for "${name}"`);
  const [color, iconName, title, tagline] = CARDS[name];
  const html = path.join(tmp, "card.html");
  fs.writeFileSync(html, page(color, await icon(iconName), title, tagline));
  const out = path.join(ROOT, "images", `${name}.png`);
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=600,300",
    "--virtual-time-budget=8000",
    `--screenshot=${out}`,
    `file://${html}`,
  ], { stdio: "ignore" });
  console.log(`✓ images/${name}.png`);
}
fs.rmSync(tmp, { recursive: true, force: true });
