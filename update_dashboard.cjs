const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /You're on fire! Keep learning today to reach a \{streakDays \+ 1\}-day streak at Taj Institute\./g,
    `You're on fire! Keep learning today to reach a {streakDays + 1}-day streak at <span style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", fontWeight: "600" }}>Taj Institute</span>.`
  );

  content = content.replace(
    /Earn official credentials from Taj Institute of Technology & Applied Networks\./g,
    `Earn official credentials from <span style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", fontWeight: "600" }}>Taj Institute of Technology & Applied Networks</span>.`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/StudentDashboardView.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});
