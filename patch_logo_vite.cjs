const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');

if (!code.includes("import titanLogo from '../assets/titan.png';")) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport titanLogo from '../assets/titan.png';");
}

code = code.replace('src="/titan.png"', 'src={titanLogo}');

fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('TitanLogo patched for Vite asset import');
