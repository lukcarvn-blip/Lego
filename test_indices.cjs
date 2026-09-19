const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n'); // Normalize for regex/indexOf

const s1 = code.indexOf("<div style={{ maxWidth: '1200px', margin: '0 auto' }}>");
const s2 = code.indexOf('<div style={{ maxWidth: "800px", margin: "0 auto" }}>');
const e2 = code.indexOf('</form>\n            )}\n          </div>\n          </div>');

console.log(s1, s2, e2);

if (s1 !== -1 && s2 !== -1 && e2 !== -1) {
    const policiesRaw = code.substring(s1, s2);
    let requestRaw = code.substring(s2, e2 + 50); // include end string, wait let's just use slicing

    // Clean up wrappers
    const policies = policiesRaw
        .replace("<div style={{ maxWidth: '1200px', margin: '0 auto' }}>", '')
        .replace("marginBottom: '4rem'", "marginBottom: '0'")
        .replace("minmax(250px", "minmax(200px")
        .replace(/<\/div>\s*<\/div>\s*$/, ''); // strip trailing divs

    const request = requestRaw
        .replace('<div style={{ maxWidth: "800px", margin: "0 auto" }}>', '')
        .replace(/<\/div>\s*<\/div>\s*$/, '');

    const newCode = code.substring(0, s1) + 
`<div className="community-bottom-split">
  <div className="community-request-side">
    ${request}
    </div>
  </div>
  <div className="community-policies-side">
    ${policies}
  </div>
</div>` + code.substring(e2 + '</form>\n            )}\n          </div>\n          </div>'.length);

    fs.writeFileSync('src/pages/Community.tsx', newCode, 'utf8');
    console.log("Success");
}
