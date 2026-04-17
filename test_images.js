const fs = require('fs');
const path = require('path');
const vegetableDir = 'src/content/vegetables';
const recipeDir = 'src/content/recipes'; // let's check recipes too
const imageBase = 'public';

function checkImages(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const imageMatch = content.match(/image:\s*"?([^"\n]*)"?/);
    if (imageMatch) {
      const imagePath = imageMatch[1];
      if (!imagePath) {
        console.log(`${filePath}: Empty image field`);
      } else {
        const fullImagePath = path.join(imageBase, imagePath);
        if (!fs.existsSync(fullImagePath) && !imagePath.startsWith('http')) {
          console.log(`${filePath}: Image file does not exist -> ${imagePath}`);
        }
      }
    } else {
      console.log(`${filePath}: No image field`);
    }
  }
}

console.log("Checking vegetables:");
checkImages(vegetableDir);
console.log("\nChecking recipes:");
checkImages(recipeDir);
