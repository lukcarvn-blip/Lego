const fs = require('fs');
const lines = fs.readFileSync('src/context/StoreContext.tsx', 'utf8').split('\n');
lines.splice(0, 3, "import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';");
fs.writeFileSync('src/context/StoreContext.tsx', lines.join('\n'), 'utf8');
console.log('Fixed React import properly');
