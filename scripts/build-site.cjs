const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const entries = ['index.html', 'SilverZ_Portfolio.html', 'starfield-preview.html', 'app.js', 'content.js', 'fitness-data.js', 'trading-data.js', 'game-atlas.js', 'starfield.js', 'styles.css'];
const assetPattern = /assets\/[^\s"'`<>\\)]+\.(?:png|jpe?g|webp|svg|mp4|webm|js|gif)/gi;
(async () => {
  // Only this fixed generated directory is cleared; source assets remain untouched.
  if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw Error('Invalid build directory');
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(path.join(output, 'assets', 'optimized'), { recursive: true });
  const texts = new Map();
  const assets = new Set();
  for (const name of entries) texts.set(name, await fs.readFile(path.join(root, name), 'utf8'));
  for (const source of texts.values()) for (const match of source.matchAll(assetPattern)) assets.add(match[0]);
  // Discover references inside asset scripts, too.
  for (const name of assets) if (/\.js$/i.test(name)) {
    const source = await fs.readFile(path.join(root, name), 'utf8');
    texts.set(name, source);
    for (const match of source.matchAll(assetPattern)) assets.add(match[0]);
  }
  const replacements = new Map();
  let before = 0, after = 0, count = 0;
  for (const name of assets) {
    const absolute = path.resolve(root, name);
    if (!absolute.startsWith(path.join(root, 'assets') + path.sep)) throw Error(`Invalid asset: ${name}`);
    const input = await fs.readFile(absolute);
    if (/\.(png|jpe?g)$/i.test(name)) {
      // Preserve resolution and transparency. Higher quality keeps small card lettering legible.
      const image = await sharp(input).rotate().webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer();
      if (image.length < input.length * .95) {
        const hash = crypto.createHash('sha256').update(image).digest('hex').slice(0, 16);
        const target = `assets/optimized/${path.basename(name, path.extname(name))}-${hash}.webp`;
        await fs.writeFile(path.join(output, target), image);
        replacements.set(name, target);
        before += input.length; after += image.length; count++;
        console.log(`${name}: ${(input.length / 1024).toFixed(0)} -> ${(image.length / 1024).toFixed(0)} KB`);
        continue;
      }
    }
    await fs.mkdir(path.dirname(path.join(output, name)), { recursive: true });
    await fs.writeFile(path.join(output, name), input);
  }
  for (const [name, original] of texts) {
    let source = original;
    for (const [from, to] of replacements) source = source.split(from).join(to);
    await fs.mkdir(path.dirname(path.join(output, name)), { recursive: true });
    await fs.writeFile(path.join(output, name), source);
  }
  console.log(`Optimized ${count} images: ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (${Math.round((1 - after / before) * 100)}% smaller).`);
})();
