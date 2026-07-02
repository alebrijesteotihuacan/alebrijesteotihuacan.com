/*
   Alebrijes de Oaxaca Teotihuacán
   Brijitienda - Conversor de imágenes a WebP

   Convierte todos los .jpg / .jpeg / .png de
   assets/Productos_Tienda/ a .webp junto al original.

   Uso:
       node scripts/convertir-tienda-webp.js
       node scripts/convertir-tienda-webp.js --force   (sobrescribe .webp existentes)

   Requiere: sharp (se instala automáticamente vía npx si no está).
*/

const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'assets', 'Productos_Tienda');
const VALID_EXT = new Set(['.jpg', '.jpeg', '.png']);
const FORCE = process.argv.includes('--force');
const QUALITY = 80;

async function loadSharp() {
    try {
        return require('sharp');
    } catch {
        console.log('Instalando sharp (primera vez)...');
        require('child_process').execSync('npm install --no-save --no-audit --no-fund sharp', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });
        return require('sharp');
    }
}

function formatKB(bytes) {
    return (bytes / 1024).toFixed(1) + ' KB';
}

async function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        console.error('No existe la carpeta:', TARGET_DIR);
        process.exit(1);
    }

    const sharp = await loadSharp();
    const files = fs.readdirSync(TARGET_DIR)
        .filter(f => VALID_EXT.has(path.extname(f).toLowerCase()))
        .sort();

    if (!files.length) {
        console.log('No se encontraron imágenes para convertir.');
        return;
    }

    console.log(`Encontradas ${files.length} imágenes en ${path.relative(process.cwd(), TARGET_DIR)}\n`);

    let totalOrig = 0;
    let totalWebp = 0;
    let converted = 0;
    let skipped = 0;

    for (const name of files) {
        const src = path.join(TARGET_DIR, name);
        const dst = path.join(TARGET_DIR, path.parse(name).name + '.webp');

        if (fs.existsSync(dst) && !FORCE) {
            const s = fs.statSync(src).size;
            const d = fs.statSync(dst).size;
            totalOrig += s;
            totalWebp += d;
            skipped++;
            continue;
        }

        const origSize = fs.statSync(src).size;
        try {
            await sharp(src)
                .webp({ quality: QUALITY, effort: 4 })
                .toFile(dst);

            const newSize = fs.statSync(dst).size;
            const diff = ((1 - newSize / origSize) * 100).toFixed(1);
            totalOrig += origSize;
            totalWebp += newSize;
            converted++;
            console.log(`  ✓ ${name}  →  ${path.basename(dst)}  (${formatKB(origSize)} → ${formatKB(newSize)}  -${diff}%)`);
        } catch (err) {
            console.error(`  ✗ ${name}: ${err.message}`);
        }
    }

    console.log('\n────────────────────────────────────────');
    console.log(`Convertidas: ${converted}   |   Omitidas (ya existían): ${skipped}`);
    console.log(`Peso original total: ${formatKB(totalOrig)}`);
    console.log(`Peso WebP total:     ${formatKB(totalWebp)}`);
    if (totalOrig > 0) {
        const totalDiff = ((1 - totalWebp / totalOrig) * 100).toFixed(1);
        console.log(`Ahorro: ${formatKB(totalOrig - totalWebp)}  (${totalDiff}%)`);
    }
    console.log('────────────────────────────────────────');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
