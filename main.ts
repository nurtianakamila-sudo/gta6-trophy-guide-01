// Leonida Trophy Guide — entrypoint (Node 22, standard library only).
//
// Hands the guide in: copies app/ and screenshots/ from beside this file to
// the output directory and writes output/dossier.json with the vendored
// make.fun library. The app itself is plain static files — index.html, one
// stylesheet, one module script and the trophy data — and works offline.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's own caps (see the competition's RULES.txt): only
// text_max_bytes shapes the dossier's bytes; the rest refuse an entry the
// scorer would refuse anyway, so the check fails here first, loudly.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(repoDir, 'app');
const shotsDir = join(repoDir, 'screenshots');

function countTree(dir) {
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = countTree(path);
      files += sub.files + 1;
      bytes += sub.bytes;
    } else if (entry.isFile()) {
      files += 1;
      bytes += statSync(path).size;
    } else {
      throw new Error(`refusing non-regular file in app/: ${path}`);
    }
  }
  return { files, bytes };
}

function checkShots() {
  if (!existsSync(shotsDir)) throw new Error('screenshots/ is missing');
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > CAPS.screenshots.max) {
    throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
  }
  for (const name of shots) {
    const size = statSync(join(shotsDir, name)).size;
    if (size > CAPS.screenshots.max_bytes) {
      throw new Error(`screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
    }
  }
  return shots;
}

function main() {
  if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
  const app = countTree(appDir);
  if (app.files > CAPS.app_max_files) throw new Error(`app/ has ${app.files} entries, over the 993 cap`);
  if (app.bytes > CAPS.app_max_bytes) throw new Error(`app/ is ${app.bytes} bytes, over the 48 MiB cap`);
  const shots = checkShots();

  mkdirSync(outDir, { recursive: true });
  cpSync(appDir, join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

  writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, CAPS));

  const dossierSize = statSync(join(outDir, 'dossier.json')).size;
  console.log(
    `Leonida Trophy Guide: app/ ${app.files} files, ${app.bytes} bytes; ` +
      `${shots.length} screenshots (${shots.join(', ')}); ` +
      `dossier.json ${dossierSize} bytes written to ${outDir}`,
  );
}

main();
