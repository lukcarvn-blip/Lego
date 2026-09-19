const fs = require('fs');

function replacePolicies(filePath, isCommunity) {
  let code = fs.readFileSync(filePath, 'utf8');

  // We want to replace the `gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'` block and its children.
  // Actually, let's just find the `grid` div and its children.
  const gridStart = code.indexOf(`<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'`);
  if (gridStart === -1) {
    console.log("Could not find gridStart in " + filePath);
    return;
  }
  
  // The header h3 is right before it.
  const h3Start = code.lastIndexOf(`<h3 style={{ fontSize: '1.5rem'`, gridStart);
  if (h3Start === -1) {
     console.log("h3 not found");
     return;
  }

  // The end of the grid is where the 4th policy ends. Policy 4 contains 'Thu mua lại'.
  const p4 = code.indexOf(`Thu mua lại`, gridStart);
  const p4End = code.indexOf(`</div>`, p4);
  const gridEnd = code.indexOf(`</div>`, p4End + 6) + 6;

  let gridStr = code.substring(gridStart, gridEnd);
  
  // replace the grid container
  gridStr = gridStr.replace(/<div style=\{\{ display: 'grid'.*?\}\}>/s, `<div className="${isCommunity ? 'policies-grid-half' : 'policies-grid'}">`);
  
  // remove glass-panel from children
  gridStr = gridStr.replace(/className="glass-panel" style=\{\{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' \}\}/g, `style={{ textAlign: 'center', padding: '0.5rem' }}`);

  // replace the whole block (h3 + grid) with the wrapped block
  const h3Str = code.substring(h3Start, gridStart);
  const fullBlock = h3Str + gridStr;

  const newBlock = `<div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            ${h3Str.replace("marginBottom: '2rem'", "marginBottom: '2.5rem'")}
            ${gridStr}
          </div>`;

  code = code.substring(0, h3Start) + newBlock + code.substring(gridEnd);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log("Fixed", filePath);
}

replacePolicies('src/pages/ProductDetails.tsx', false);
replacePolicies('src/pages/Community.tsx', true);
