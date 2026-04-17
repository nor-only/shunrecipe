const fs = require('fs');
const content = fs.readFileSync('src/data/recipes-prefectures.ts', 'utf8');
const r = /id:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"]/g;
let m;
while(m = r.exec(content)){
    console.log(m[1] + '|' + m[2]);
}
