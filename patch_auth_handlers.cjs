const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

code = code.replace(/setRole\(/g, 'setSelectedRole(');
code = code.replace(/role ===/g, 'selectedRole ===');
code = code.replace(/onSubmit=\{handleLogin\}/g, 'onSubmit={handleSubmit}');
code = code.replace(/onSubmit=\{handleRegister\}/g, 'onSubmit={handleSubmit}');

fs.writeFileSync('src/components/AuthScreen.tsx', code);
console.log('Fixed auth handlers');
