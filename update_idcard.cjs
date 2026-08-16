const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<p className="text-zinc-400 text-\[8px\] font-mono tracking-widest uppercase mt-1">Taj Institute of Technology<\/p>/g,
    `<p className="text-zinc-400 text-[8px] font-mono tracking-widest uppercase mt-1" style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>Taj Institute of Technology</p>`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/StudentIDCard.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
