const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// Find pd-review-btn and move it inside pd-title-row
// Right now, pd-review-btn is placed after the closing </div> of pd-title-row.
const rowStr = '<div className="pd-title-row"';
const btnStr = '<button className="pd-review-btn"';

let p1 = code.indexOf(rowStr);
let p2 = code.indexOf(btnStr);

if (p1 > -1 && p2 > -1) {
    // Find the </div> that closes pd-title-row
    // It's just before btnStr
    let beforeBtn = code.substring(p1, p2);
    // Replace the last </div> in beforeBtn with empty string, 
    // and append </div> after the button.
    
    // Specifically, let's just use regex to move the button.
    // The current buggy structure is:
    // </div>
    // </div>
    // </div>
    // <button className="pd-review-btn" ... > ... </button>
    // </div>
    
    // I want to change it to:
    // </div>
    // </div>
    // <button className="pd-review-btn" ... > ... </button>
    // </div>
    // </div>
    
    const targetPattern = /<\/div>\s*<\/div>\s*<\/div>\s*<button className="pd-review-btn"([\s\S]*?)<\/button>\s*<\/div>/;
    const match = code.match(targetPattern);
    if (match) {
        const replaceWith = `</div>\n          </div>\n          <button className="pd-review-btn"${match[1]}</button>\n        </div>\n      </div>`;
        code = code.replace(targetPattern, replaceWith);
        fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
        console.log('Successfully fixed tag hierarchy.');
    } else {
        console.log('Regex did not match.');
        // fallback regex:
        const target2 = /<\/div>\s*<\/div>\s*<\/div>\s*<button className="pd-review-btn"/;
        if (code.match(target2)) {
            console.log('Pattern matched start, but not end.');
        } else {
            console.log('Pattern not matched at all.');
            console.log('Here is the area around btn:');
            console.log(code.substring(p2 - 100, p2 + 100));
        }
    }
} else {
    console.log('Strings not found');
}
