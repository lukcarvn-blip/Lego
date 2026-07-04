const fs = require('fs');
const file = 'C:/Users/Thinkpad P1 gen 6/.gemini/antigravity/scratch/loge-store/src/data/mockBlogPosts.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace all unsplash image URLs with custom logo
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9?&=-]+/g, '/images/custom-logo.png');

// Add background and aspect ratio to img tags
content = content.replace(/<img src="\/images\/custom-logo\.png" alt="([^"]+)" style="([^"]+)"/g, '<img src="/images/custom-logo.png" alt="$1" style="$2; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;"');

fs.writeFileSync(file, content);
console.log('Done replacing images');
