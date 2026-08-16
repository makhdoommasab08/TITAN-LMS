const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /Taj Institute of Technology and Applied Networks/g,
    `<span style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", fontWeight: "600" }}>Taj Institute of Technology & Applied Networks</span>`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/AuthScreen.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
