const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');

code = code.replace("import logoImage from '../assets/titan.png';", "");
code = code.replace("src={logoImage}", "src=\"/titan.png\"");

fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('TitanLogo patched for public strategy');
