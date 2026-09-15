const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /<span style={{ lineHeight: 1\.1 }}>\{details\?\.name\}<\/span>[\s\S]*?\{details\?\.heightCm && <span style={{ fontSize: '0\.45rem', opacity: 0\.7, lineHeight: 1 }}>\(\{details\?\.heightCm \? `\$\{details\.heightCm\} cm` : ""\}\)<\/span>\}/;

const newSizeBadge = `{(() => {
                    const parts = (details?.name || '').split(':');
                    const displayName = parts[0].trim();
                    const sizeText = parts.length > 1 ? parts[1].trim() : (details?.heightCm ? \`\${details.heightCm} cm\` : "");
                    return (
                      <>
                        <span style={{ lineHeight: 1.1 }}>{displayName}</span>
                        {sizeText && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({sizeText})</span>}
                      </>
                    );
                  })()}`;
                  
code = code.replace(regex, newSizeBadge);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed size badge');
