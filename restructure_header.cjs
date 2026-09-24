const fs = require('fs');

let lines = fs.readFileSync('src/pages/Community.tsx', 'utf8').split('\n');

const startIntro = lines.findIndex(l => l.includes('<div className="community-intro-side">'));
const startVision = lines.findIndex((l, i) => i > startIntro && l.includes('{/* Development Vision */}'));
const endIntro = lines.findIndex((l, i) => i > startVision && l.includes('</div>') && lines[i+2] && lines[i+2].includes('<div className="community-policies-side">'));

console.log('Intro starts at', startIntro);
console.log('Vision starts at', startVision);
console.log('Intro ends at', endIntro);

if (startIntro !== -1 && startVision !== -1 && endIntro !== -1) {
  const headerContent = lines.slice(startIntro + 1, startVision);
  const visionContent = lines.slice(startVision, endIntro);

  const newHeader = [
    '        <div className="community-header-split">',
    '          <div className="community-header-intro">',
    ...headerContent,
    '          </div>',
    '          <div className="community-header-vision">',
    ...visionContent,
    '          </div>',
    '        </div>'
  ];

  lines.splice(startIntro, endIntro - startIntro + 1, ...newHeader);

  fs.writeFileSync('src/pages/Community.tsx', lines.join('\n'), 'utf8');
  console.log('Modified Community.tsx successfully!');
} else {
  console.log('Failed to find exact boundaries!');
}
