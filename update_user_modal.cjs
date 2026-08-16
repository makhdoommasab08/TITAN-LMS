const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<p className="font-semibold text-xs mt-0\.5 truncate">Taj Institute of Technology<\/p>/g,
    `<p className="font-semibold text-xs mt-0.5 truncate" style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>Taj Institute of Technology</p>`
  );

  content = content.replace(
    /<span>Taj Institute of Technology & Applied Networks<\/span>/g,
    `<span style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>Taj Institute of Technology & Applied Networks</span>`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/UserProfileModal.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});

