const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

// I'm going to parse the AST or just fix it manually.
// Let's replace the whole ending block starting from </form>
const replaceStart = code.lastIndexOf('</form>');
if (replaceStart > -1) {
    const startPart = code.substring(0, replaceStart + 7); // include </form>
    const correctEnding = `
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  </div>
  );
};
`;
    fs.writeFileSync('src/pages/Community.tsx', startPart + correctEnding, 'utf8');
    console.log('Fixed using exact string replacement.');
}
