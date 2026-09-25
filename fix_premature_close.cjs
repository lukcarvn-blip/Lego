const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');
const lines = code.split('\n');

// Delete line 400 (which is index 399)
if (lines[399].trim() === '</div>') {
    lines.splice(399, 1);
    console.log('Removed premature closing of community-footer-split');
} else {
    console.log('Line 400 is not a closing div:', lines[399]);
}

// Now we need to add </div> back to the end
const replaceStart = lines.findIndex(l => l.includes('</form>'));
if (replaceStart > -1) {
    // Add one more </div> to the end
    lines.splice(replaceStart + 1, lines.length - replaceStart - 1, 
        '            )}',
        '          </div>',
        '        </div>',
        '      </div>', // This is the new one for community-footer-split
        '      </motion.div>',
        '    </div>',
        '  </div>',
        '  );',
        '};'
    );
    fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
    console.log('Fixed wrapper logic!');
}
