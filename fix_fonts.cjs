const fs = require('fs');
const glob = require('glob');

function updateContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace font family globally
  content = content.replace(/'Source Sans 3', 'Source Sans Pro', sans-serif/g, "'Source Serif 4', 'Source Serif 4 Variable', 'Source Serif Pro', serif");

  // Remove text-transform: uppercase from CSS
  content = content.replace(/text-transform:\s*uppercase;\s*\n/g, '');

  // Remove 'uppercase' from classNames related to the text
  content = content.replace(/className="uppercase font-bold /g, 'className="font-bold ');
  content = content.replace(/ uppercase /g, ' ');

  // Specific TitanLogo fixing for TAJ -> Taj
  content = content.replace(/TAJ INSTITUTE OF TECHNOLOGY & APPLIED NETWORK/g, "Taj Institute of Technology & Applied Network");
  
  // Replace uppercase instances in classNames specifically for Taj text
  content = content.replace(/text-slate-700 uppercase mt-0\.5/g, 'text-slate-700 mt-0.5');

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/TitanLogo.tsx',
  'src/components/CertificatesModal.tsx',
  'src/components/StudentIDCard.tsx',
  'src/components/UserProfileModal.tsx',
  'src/components/StudentDashboardView.tsx',
  'src/components/CourseResourcesView.tsx',
  'src/components/AuthScreen.tsx',
  'src/App.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    updateContent(f);
    console.log(`Updated ${f}`);
  }
});
