const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /curated by Taj Institute faculty/g,
    `curated by <span style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", fontWeight: "600" }}>Taj Institute</span> faculty`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/CourseResourcesView.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
