const fs = require('fs');
let code = fs.readFileSync('src/components/TitanLogo.tsx', 'utf8');

// Add import
code = code.replace("import React from 'react';", "import React from 'react';\nimport logoImage from '../assets/titan.png';");

// Use imported variable
code = code.replace('src="/titan.png"', 'src={logoImage}');

fs.writeFileSync('src/components/TitanLogo.tsx', code);
console.log('TitanLogo patched for Vercel');
