const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// I will just replace the specific lines by regex
code = code.replace(
  "inset: '15% 0 15% 0'",
  "inset: '15% 6% 15% 6%'"
);

code = code.replace(
  "{showcaseCharacters.map((char, idx) => (",
  `{showcaseCharacters.map((char, idx) => {
                const c = idx % 5;
                const r = Math.floor(idx / 5);
                const bgPosX = ((6 + c * 17.6) / 82.4) * 100;
                const bgPosY = ((15 + r * 35) / 65) * 100;
                
                return (`
);

code = code.replace(
  "backgroundSize: '500% 285.71428%',",
  "backgroundSize: '568.1818% 285.71428%',"
);

code = code.replace(
  "backgroundPosition: `${(idx % 5) * 25}% ${((15 + Math.floor(idx / 5) * 35) / 65) * 100}%`,",
  "backgroundPosition: `${bgPosX}% ${bgPosY}%`,"
);

code = code.replace(
  `                  </div>
                </div>
              ))}
            </div>`,
  `                  </div>
                </div>
              );})}
            </div>`
);

fs.writeFileSync('src/pages/Home.tsx', code, 'utf8');
console.log('Fixed Home.tsx correctly');
