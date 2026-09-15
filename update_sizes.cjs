const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Update the vertical size options button
const oldButtonText = `<span style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>{sizeDetails?.name}</span>`;
const newButtonText = `
                        {(() => {
                          const parts = (sizeDetails?.name || '').split(':');
                          const displayName = parts[0].trim();
                          return (
                            <span style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>{displayName}</span>
                          );
                        })()}
`;
code = code.replace(oldButtonText, newButtonText);

// 2. Update the ruler text
const oldRulerText = `{sizeDetails?.heightCm ? \`\${sizeDetails.heightCm} cm\` : ""}`;
const newRulerText = `{(() => {
                              const parts = (sizeDetails?.name || '').split(':');
                              if (parts.length > 1) {
                                return parts[1].trim();
                              }
                              return sizeDetails?.heightCm ? \`\${sizeDetails.heightCm} cm\` : "";
                            })()}`;
code = code.replace(oldRulerText, newRulerText);

// 3. Update the Size Badge (top left)
const oldSizeBadge = `<span style={{ lineHeight: 1.1 }}>{details?.name}</span>
                  {details?.heightCm && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({details?.heightCm ? \`\${details.heightCm} cm\` : ""})</span>}`;
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
code = code.replace(oldSizeBadge, newSizeBadge);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Updated size display logic');
