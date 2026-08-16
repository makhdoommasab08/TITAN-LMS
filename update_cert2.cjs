const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<p className="text-xs font-mono text-blue-400">Taj Institute of Technology & Applied Network Credentials<\/p>/g,
    `<p className="text-xs font-mono text-blue-400" style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>Taj Institute of Technology & Applied Network Credentials</p>`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/CertificatesModal.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
