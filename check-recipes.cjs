const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?image:\s*['"]([^'"]*)['"]/g;
let match;
const map = new Map();
while(match = regex.exec(content)) {
    const id = match[1];
    const img = match[2];
    if(map.has(img)) {
        console.log('DUPLICATE IMAGE:', img, 'used in', map.get(img), 'and', id);
    } else if(img === '') {
        console.log('MISSING IMAGE:', id);
    } else {
        map.set(img, id);
        const fullPath = 'public' + img;
        if(!fs.existsSync(fullPath)) {
            console.log('FILE NOT FOUND:', img, 'for', id);
        }
    }
}
