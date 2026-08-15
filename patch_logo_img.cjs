const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');
code = code.replace(
  "src=\"/titan-logo.svg\"",
  "src=\"/titan.png\""
);
fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('Logo img patched');
