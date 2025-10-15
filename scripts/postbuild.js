const path = require('path');
const {
  cpSync,
  rmSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} = require('fs');

const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');
const distPublicDir = path.join(distDir, 'public');

function copyPublicAssets() {
  if (!existsSync(publicDir)) {
    console.warn('[postbuild] public directory not found, skipping static asset copy.');
    return;
  }

  rmSync(distPublicDir, { recursive: true, force: true });
  mkdirSync(distPublicDir, { recursive: true });

  cpSync(publicDir, distPublicDir, { recursive: true });
}

function rewriteIndexEntryPoint() {
  const indexPath = path.join(distPublicDir, 'index.html');
  if (!existsSync(indexPath)) {
    return;
  }

  const original = readFileSync(indexPath, 'utf8');
  const rewritten = original.replace(/src="(?:\.\/)?main\.tsx"/g, 'src="/assets/main.js"');

  writeFileSync(indexPath, rewritten);

  const builtAssetPath = path.join(distPublicDir, 'assets', 'main.js');
  if (!existsSync(builtAssetPath)) {
    console.warn(
      '[postbuild] Warning: dist/public/assets/main.js not found. Run "npm run build:frontend" before "npm run build" to include the frontend bundle.'
    );
  }
}

function main() {
  copyPublicAssets();
  rewriteIndexEntryPoint();
}

main();
