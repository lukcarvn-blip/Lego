const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('HeartBurst')) {
  code = code.replace("import { ToastContainer } from './components/Toast';", 
                      "import { ToastContainer } from './components/Toast';\nimport { HeartBurst } from './components/HeartBurst';");
  code = code.replace("<ToastContainer />", "<ToastContainer />\n        <HeartBurst />");
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log('Added to App.tsx');
} else {
  console.log('Already in App.tsx');
}
