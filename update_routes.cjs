const fs = require('fs');

// App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace("import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';", "import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';");
appCode = appCode.replace('<Route path="/leaderboard" element={<Leaderboard />} />', '<Route path="/leaderboard" element={<Navigate to="/community" replace />} />');
fs.writeFileSync('src/App.tsx', appCode, 'utf8');

// Navbar.tsx
let navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
// Remove <Link to="/leaderboard" ... > Bảng Xếp Hạng </Link>
// I need to use regex to find and remove the Link containing /leaderboard
const lbLinkRegex = /<Link\s+to="\/leaderboard"[\s\S]*?<\/Link>/g;
navbarCode = navbarCode.replace(lbLinkRegex, '');
fs.writeFileSync('src/components/Navbar.tsx', navbarCode, 'utf8');

console.log('App.tsx and Navbar.tsx updated successfully.');
