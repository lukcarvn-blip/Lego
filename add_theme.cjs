const fs = require('fs');

// ============================================================
// 1. StoreContext.tsx — add siteTheme to type + state + apply effect
// ============================================================
let ctx = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1a. Add field to interface
ctx = ctx.replace(
  "  bankOwner?: string;\n}",
  "  bankOwner?: string;\n  siteTheme?: 'dark' | 'light';\n}"
);

// 1b. Add default value in useState
ctx = ctx.replace(
  "    bankOwner: 'LE NHAT HOANG'\n  });",
  "    bankOwner: 'LE NHAT HOANG',\n    siteTheme: 'dark'\n  });"
);

// 1c. Apply theme to document root whenever settings change
// We'll add a useEffect after the settings useState
ctx = ctx.replace(
  "  const [language, setLanguage] = useState<Language>('vi');",
  `  // Apply theme CSS class to document
  useEffect(() => {
    const theme = settings.siteTheme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.siteTheme]);

  const [language, setLanguage] = useState<Language>('vi');`
);

fs.writeFileSync('src/context/StoreContext.tsx', ctx, 'utf8');
console.log('StoreContext updated');

// ============================================================
// 2. index.css — add [data-theme="light"] CSS overrides
// ============================================================
let css = fs.readFileSync('src/index.css', 'utf8');

const lightTheme = `
/* ═══════════════════════════════════════════════
   LIGHT THEME OVERRIDES
   Applied via data-theme="light" on <html>
════════════════════════════════════════════════ */
[data-theme="light"] {
  --color-bg: #f0f4f0;
  --color-surface: #e8f0e8;
  --color-primary: #c8e6c8;
  --color-primary-light: #4caf50;
  --color-accent: #2e7d32;
  --color-accent-hover: #388e3c;

  --color-text: #1a2e1a;
  --color-text-muted: #4a6a4a;

  --glass-bg: rgba(200, 230, 200, 0.55);
  --glass-bg-hover: rgba(180, 220, 180, 0.70);
  --glass-border: rgba(46, 125, 50, 0.18);
  --glass-border-hover: rgba(46, 125, 50, 0.40);
  --glass-shadow: 0 8px 32px 0 rgba(0, 60, 0, 0.12);
}

[data-theme="light"] body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

[data-theme="light"] .glass-panel {
  background: rgba(210, 240, 210, 0.7) !important;
  border-color: rgba(46, 125, 50, 0.2) !important;
  box-shadow: 0 4px 24px rgba(0, 80, 0, 0.08) !important;
}

[data-theme="light"] header,
[data-theme="light"] .admin-sidebar {
  background: rgba(220, 245, 220, 0.90) !important;
  border-color: rgba(46, 125, 50, 0.15) !important;
}

[data-theme="light"] input,
[data-theme="light"] select,
[data-theme="light"] textarea {
  background: rgba(255,255,255,0.8) !important;
  color: var(--color-text) !important;
  border-color: rgba(46, 125, 50, 0.25) !important;
}

[data-theme="light"] .btn-primary {
  background: var(--color-accent) !important;
  color: #fff !important;
}

[data-theme="light"] .hero-title {
  background: linear-gradient(to right, #1a2e1a 0%, #2e7d32 40%, #4caf50 60%, #2e7d32 80%, #1a2e1a 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

[data-theme="light"] .chamfer-btn {
  background: rgba(200, 230, 200, 0.7) !important;
  border-color: rgba(46, 125, 50, 0.25) !important;
  color: var(--color-text) !important;
}

[data-theme="light"] tr {
  border-color: rgba(46, 125, 50, 0.12) !important;
}
`;

// Add before end of file
css = css + lightTheme;
fs.writeFileSync('src/index.css', css, 'utf8');
console.log('index.css updated with light theme');

// ============================================================
// 3. Admin.tsx — add theme toggle to Settings tab
// ============================================================
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Find "Cài đặt ngân hàng" or bankName section and add theme setting before it
const themeSettingCard = `              {/* Theme */}
              <div style={panelStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sun size={20} style={{ color: 'var(--color-accent)' }} /> Giao diện
                </h3>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Chủ đề màu sắc</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.6rem 1.2rem', borderRadius: '8px', border: \`2px solid \${settingsForm.siteTheme !== 'light' ? 'var(--color-accent)' : 'var(--glass-border)'}\`, background: settingsForm.siteTheme !== 'light' ? 'rgba(74,222,128,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                    <input type="radio" name="siteTheme" value="dark" checked={settingsForm.siteTheme !== 'light'} onChange={() => setSettingsForm(f => ({ ...f, siteTheme: 'dark' }))} style={{ display: 'none' }} />
                    <Moon size={18} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tối (Mặc định)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.6rem 1.2rem', borderRadius: '8px', border: \`2px solid \${settingsForm.siteTheme === 'light' ? 'var(--color-accent)' : 'var(--glass-border)'}\`, background: settingsForm.siteTheme === 'light' ? 'rgba(74,222,128,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                    <input type="radio" name="siteTheme" value="light" checked={settingsForm.siteTheme === 'light'} onChange={() => setSettingsForm(f => ({ ...f, siteTheme: 'light' }))} style={{ display: 'none' }} />
                    <Sun size={18} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sáng</span>
                  </label>
                </div>
              </div>\n`;

// Find the bank settings card to insert theme card before it
const bankCardStart = '              {/* Bank */}';
admin = admin.replace(bankCardStart, themeSettingCard + bankCardStart);

// Ensure Sun and Moon are imported (Moon may already be imported, Sun might not)
if (!admin.includes("Sun,") && !admin.includes(", Sun") && !admin.includes("{Sun}")) {
  admin = admin.replace("import { ", "import { Sun, ");
}

fs.writeFileSync('src/pages/Admin.tsx', admin, 'utf8');
console.log('Admin.tsx updated with theme toggle');
