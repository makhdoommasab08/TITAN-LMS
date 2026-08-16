const fs = require('fs');
let content = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');
content = content.replace(/TAJ INSTITUTE OF TECHNOLOGY/g, "Taj Institute of Technology");
fs.writeFileSync('src/components/TitanLogo.tsx', content);
