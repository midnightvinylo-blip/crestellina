const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'assets', 'media');

async function convert() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    for (const file of files) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
        try {
            await sharp(input).webp({ quality: 80 }).toFile(output);
            console.log(`Converted ${file} to WebP`);
            // Optional: Remove original if we wanted to
            // fs.unlinkSync(input); 
        } catch (e) {
            console.error(`Failed to convert ${file}`, e);
        }
    }
}

convert();
