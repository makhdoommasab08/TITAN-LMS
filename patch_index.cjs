const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('<link rel="icon"')) {
  code = code.replace('<head>', '<head>\n    <link rel="icon" type="image/png" href="/titan.png" />');
  fs.writeFileSync('index.html', code);
  console.log('Favicon added to index.html');
}
