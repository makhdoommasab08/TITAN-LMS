const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Replace the video source back to local MP4
code = code.replace(
  '<source src="https://ak.picdn.net/shutterstock/videos/1027162622/preview/stock-footage-abstract-digital-data-processing-on-screen-background-loop-technology-cyber-security-hacker.mp4" type="video/mp4" />',
  '<source src="/VID_20260815_221826_1.mp4" type="video/mp4" />'
);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
console.log('AuthScreen video patched back to local');
