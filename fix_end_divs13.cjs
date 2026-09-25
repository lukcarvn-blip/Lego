const fs = require('fs');
let code = fs.readFileSync('src/pages/Community.tsx', 'utf8');

const replaceStart = code.lastIndexOf('</form>');
if (replaceStart > -1) {
    const startPart = code.substring(0, replaceStart + 7); // include </form>
    // we need 1 LESS closing div than currently
    const correctEnding = `
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};
`;
    fs.writeFileSync('src/pages/Community.tsx', startPart + correctEnding, 'utf8');
}
