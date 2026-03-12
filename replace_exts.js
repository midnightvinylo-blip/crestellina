const fs = require('fs');
const files = ['index.html', 'tienda.html', 'nosotros.html', 'experiencias.html', 'ubicacion.html'];
for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        if (content.match(/\.(png|jpg|jpeg)/i)) {
            content = content.replace(/\.png/gi, '.webp');
            content = content.replace(/\.jpg/gi, '.webp');
            content = content.replace(/\.jpeg/gi, '.webp');
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
}
