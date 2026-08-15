const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');
code = code.replace(
  "src=\"/Titan-transparent-proper.png\"",
  "src=\"/titan-logo.png\""
);
fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('Logo patched');
