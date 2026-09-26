const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// The heart button is currently inside the desktop fragment.
// We need to move it out.

// 1. Find the Heart Button start index
const heartIdx = code.indexOf('{/* Heart Button */}');
if (heartIdx !== -1) {
    // 2. Find the motion.button closing tag after it
    const btnEndIdx = code.indexOf('</motion.button>', heartIdx);
    if (btnEndIdx !== -1) {
        const fullBtnEnd = btnEndIdx + '</motion.button>'.length;
        
        // 3. Extract the Heart Button code completely
        let heartBtnCode = code.substring(heartIdx, fullBtnEnd);
        
        // 4. Remove it from its current location
        let beforeHeart = code.substring(0, heartIdx);
        let afterHeart = code.substring(fullBtnEnd);
        
        // Combine them back
        code = beforeHeart + afterHeart;
        
        // Now, we need to insert it at the end of the motion.div wrapper!
        // The structure is:
        // {isMobile ? (...) : ( <> ... </> )}
        // </motion.div>
        
        // Let's find: `              </>\n            )}\n          </motion.div>`
        const insertionPointRegex = /<\/>\s*\n\s*\)\}\s*\n\s*<\/motion\.div>/;
        
        const match = code.match(insertionPointRegex);
        if (match) {
            const replaceStr = `</>\n            )}\n            \n            ${heartBtnCode}\n          </motion.div>`;
            code = code.replace(insertionPointRegex, replaceStr);
            fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
            console.log('Successfully moved heart button.');
        } else {
            console.log('Could not find insertion point.');
        }
    } else {
        console.log('Could not find btn end.');
    }
} else {
    console.log('Could not find Heart Button.');
}
