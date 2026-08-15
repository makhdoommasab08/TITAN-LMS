const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Modify the role button clicks to also set credentials so they don't have to type
code = code.replace(/onClick=\{.. => setSelectedRole\('student'\)\}/g, "onClick={() => { setSelectedRole('student'); setEmail('masab_bin.abdul_rehman@titan.edu.pk'); setPassword('password123'); }}");
code = code.replace(/onClick=\{.. => setSelectedRole\('teacher'\)\}/g, "onClick={() => { setSelectedRole('teacher'); setEmail('shahnawaz_qureshi@titan.edu.pk'); setPassword('password123'); }}");
code = code.replace(/onClick=\{.. => setSelectedRole\('admin'\)\}/g, "onClick={() => { setSelectedRole('admin'); setEmail('admin@titan.edu.pk'); setPassword('password123'); }}");

// We need to restore the exact visual look of the right side? "pehle jesa rkho" - keep it like before.
// The user prefers the previous, less "clean/flat" UI or just wanted the auto-fill. Let me restore the rounded-2xl look from the very first one if they want it EXACTLY like before.
// Or maybe I just add the auto-fill and see if they are happy. Let's do a more robust UI revert.
