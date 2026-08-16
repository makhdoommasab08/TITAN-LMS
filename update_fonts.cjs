const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // In CertificatesModal.tsx CSS
  content = content.replace(
    /\.institute-full-name \{\s+font-family: system-ui, -apple-system, sans-serif;/g,
    `.institute-full-name {\n              font-family: 'Source Sans 3', 'Source Sans Pro', sans-serif;`
  );
  content = content.replace(
    /\.signatory-org \{\s+font-family: system-ui, -apple-system, sans-serif;/g,
    `.signatory-org {\n              font-family: 'Source Sans 3', 'Source Sans Pro', sans-serif;`
  );

  // In CertificatesModal.tsx JSX
  content = content.replace(
    /<div className="font-sans text-\[8px\] sm:text-\[9\.5px\] font-extrabold tracking-wider text-slate-700 uppercase mt-0\.5">\s*Taj Institute of Technology & Applied Network\s*<\/div>/g,
    `<div className="text-[8px] sm:text-[9.5px] font-extrabold tracking-wider text-slate-700 uppercase mt-0.5" style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>\n                      Taj Institute of Technology & Applied Network\n                    </div>`
  );

  content = content.replace(
    /<span className="font-sans text-\[8px\] sm:text-\[9px\] font-semibold text-\[#0056D2\]">\s*Taj Institute of Technology & Applied Network\s*<\/span>/g,
    `<span className="text-[8px] sm:text-[9px] font-semibold text-[#0056D2]" style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif" }}>\n                    Taj Institute of Technology & Applied Network\n                  </span>`
  );
  
  fs.writeFileSync(filePath, content);
}

['src/components/CertificatesModal.tsx'].forEach(f => {
  if (fs.existsSync(f)) updateFile(f);
});

