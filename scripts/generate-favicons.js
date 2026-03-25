const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');

async function generateFavicons() {
  try {
    const svg = fs.readFileSync(svgPath);

    // Generate 32x32 PNG
    await sharp(svg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    console.log('✓ Generated favicon-32x32.png');

    // Generate 180x180 PNG (Apple touch icon)
    await sharp(svg)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon-180x180.png'));

    console.log('✓ Generated apple-touch-icon-180x180.png');

    // Generate favicon.ico from 32x32 PNG
    const pngBuffer = await sharp(svg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .png()
      .toBuffer();

    const icoBuffer = await toIco(pngBuffer);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    console.log('✓ Generated favicon.ico');
    console.log('\n✨ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
