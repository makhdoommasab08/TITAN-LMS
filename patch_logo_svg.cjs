const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');
code = code.replace(
  "src=\"/titan-logo.png\"",
  "src=\"/titan-logo.svg\""
);
fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('Logo SVG patched');
