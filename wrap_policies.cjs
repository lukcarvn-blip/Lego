const fs = require('fs');

let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// The Exclusive Policies section looks like:
//           {/* Exclusive Policies */}
//           <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
//             {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
//           </h3>
//           
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

code = code.replace(
  "          {/* Exclusive Policies */}",
  "          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>\n          {/* Exclusive Policies */}"
);

// We need to close it before the form
code = code.replace(
  "          <div style={{ maxWidth: \"800px\", margin: \"0 auto\" }}>",
  "          </div>\n\n          <div style={{ maxWidth: \"800px\", margin: \"0 auto\" }}>"
);

fs.writeFileSync('src/pages/Community.tsx', code, 'utf8');
console.log('Wrapped policies in 1200px container');
