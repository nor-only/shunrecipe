const fs = require('fs');
const path = require('path');

function updateScript(file) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /(slug:\s*'([^']+)'[\s\S]*?image:)[^,}]+([,}])/g;
    content = content.replace(regex, (match, p1, slug, p3) => {
        const imgPath = '/assets/images/veg_' + slug + '.png';
        const fullPath = path.join('public', imgPath);
        if(fs.existsSync(fullPath)) {
            return p1 + ' \'' + imgPath + '\'' + p3;
        } else {
            return p1 + ' \'\'' + p3;
        }
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
}

updateScript('scripts/gen-vegetables.mjs');
updateScript('scripts/gen-vegetables-v2.mjs');
