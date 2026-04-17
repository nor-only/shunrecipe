const fs = require('fs');

const content = fs.readFileSync('src/data/recipes-prefectures.ts', 'utf8');

// The file might export a variable, let's just parse it manually to avoid executing it
// We search for `id: "r_something"` or `id: 'r_something'`
const lines = content.split('\n');

let currentId = null;
const map = new Map();

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
         currentId = idMatch[1];
    }
    
    const imgMatch = line.match(/image:\s*['"]([^'"]*)['"]/);
    if (imgMatch && currentId) {
         const image = imgMatch[1];
         
         if (image === '') {
             console.log('Recipe missing image path:', currentId);
         } else {
             if (map.has(image)) {
                 console.log('Recipe duplicate image:', image, 'used by', map.get(image), 'and', currentId);
             } else {
                 map.set(image, currentId);
                 const fullPath = 'public' + image;
                 if (!fs.existsSync(fullPath)) {
                     console.log('Recipe missing file:', image, 'for recipe:', currentId);
                 }
             }
         }
         currentId = null; // reset for next recipe
    }
}

console.log('Total unique images mapped:', map.size);
