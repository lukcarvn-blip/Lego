const fs = require('fs');
const lines = fs.readFileSync('src/pages/Home.tsx', 'utf8').split('\n');

lines[616] = '              })}';
lines[617] = '            </div>';
lines[618] = '            );';
lines[619] = '            })()}';
lines[620] = '            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 15%, transparent 85%, rgba(10,10,10,0.9) 100%)", pointerEvents: "none" }} />';
lines[621] = '          </motion.div>';

fs.writeFileSync('src/pages/Home.tsx', lines.join('\n'), 'utf8');
console.log('Fixed syntax correctly');
