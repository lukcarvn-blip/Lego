const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// I want to transform this:
/*
      <div className="container footer-top-grid">
        <div>
          <div className="footer-logo-social-wrapper">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', margin: 0 }}>
              {settings.logoImage ? (
                <img src={settings.logoImage} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt="Logo" className="footer-logo" />
              ) : (
                settings.logoText
              )}
            </h3>
            <div className="footer-social-icons">
               ... a lot of social icons ...
            </div>
          </div>
          <div style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textTransform: 'uppercase' }}>
            {settings.contactAddress && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} /> <span style={{ lineHeight: 1.5, whiteSpace: 'pre-line' }}>{settings.contactAddress}</span></div>}
            {settings.contactHotline && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactHotline}</span></div>}
            {settings.contactEmail && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactEmail}</span></div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
*/

// Into this:
/*
      <div className="container footer-top-grid">
        <div className="footer-col-1">
          <div className="footer-logo-container">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', margin: 0 }}>
              {settings.logoImage ? (
                <img src={settings.logoImage} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt="Logo" className="footer-logo" />
              ) : (
                settings.logoText
              )}
            </h3>
          </div>
          <div className="footer-contact-info" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textTransform: 'uppercase' }}>
            {settings.contactAddress && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} /> <span style={{ lineHeight: 1.5, whiteSpace: 'pre-line' }}>{settings.contactAddress}</span></div>}
            {settings.contactHotline && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactHotline}</span></div>}
            {settings.contactEmail && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={20} style={{ color: 'var(--color-accent)' }} /> <span>{settings.contactEmail}</span></div>}
          </div>
          <div className="footer-social-icons">
               ... a lot of social icons ...
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
*/

// We can just extract the social icons string and the contact info string!
const socialIconsRegex = /<div className="footer-social-icons">([\s\S]*?)<\/div>\s*<\/div>/;
const socialMatch = code.match(socialIconsRegex);

const contactInfoRegex = /<div style=\{\{ color: 'var\(--color-text-muted\)', marginBottom: '1\.5rem'[\s\S]*?<\/div>\s*<\/div>\s*<div style=\{\{ display: 'grid'/;
const contactMatch = code.match(contactInfoRegex);

if (socialMatch && contactMatch) {
  let socialHTML = `<div className="footer-social-icons">${socialMatch[1]}</div>`;
  
  // Get contact HTML but remove the trailing closing div for column 1 and the opening of next div
  let contactHTMLStr = contactMatch[0];
  contactHTMLStr = contactHTMLStr.replace(/<\/div>\s*<\/div>\s*<div style=\{\{ display: 'grid'/, '</div>');
  
  // Replace opening
  code = code.replace(
    '      <div className="container footer-top-grid">\n        <div>\n          <div className="footer-logo-social-wrapper">',
    '      <div className="container footer-top-grid">\n        <div className="footer-col-1">\n          <div className="footer-logo-container">'
  );
  
  // Replace contact with contact + social
  const newContactStr = contactHTMLStr.replace('<div style={{ color:', '<div className="footer-contact-info" style={{ color:') + '\n          ' + socialHTML;
  
  // Re-build file
  code = code.replace(socialMatch[0], '</div>');
  code = code.replace(contactHTMLStr, newContactStr + '\n        </div>\n\n        <div style={{ display: \'grid\'');
  
  fs.writeFileSync('src/components/Footer.tsx', code, 'utf8');
  console.log('Successfully re-ordered HTML structure.');
} else {
  console.log('Failed to match');
}
