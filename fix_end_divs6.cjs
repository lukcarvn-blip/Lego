const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// There's a motion.div at line 60: <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%" }}>
// There's a div at line 59: <div className="container">
// There's a div at line 58: <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>

// The end of the file should close all of these
const correctEnd = `
        </motion.div>
      </div>
    </div>
  );
};
`;

// replace everything after the last form closing tag (or last div in the form)
const lines = code.split('\n');
const endFormIdx = lines.findIndex(l => l.includes('</form>'));
if (endFormIdx !== -1) {
    // we need to close:
    // 1. <div className="glass-panel"
    // 2. <div className="community-footer-request">
    // 3. <div className="community-footer-split">
    // 4. <motion.div>
    // 5. <div className="container">
    // 6. <div style={{ paddingTop: ...}}>
    
    lines.splice(endFormIdx + 1, lines.length - endFormIdx - 1, 
        '            )}',
        '          </div>', // closes glass-panel
        '        </div>', // closes community-footer-request
        '      </div>', // closes community-footer-split
        '      </motion.div>',
        '    </div>',
        '  </div>',
        '  );',
        '};'
    );
    fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
    console.log('Fixed entire end structure!');
} else {
    console.log('Could not find </form>');
}
