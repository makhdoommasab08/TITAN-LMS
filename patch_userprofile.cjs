const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf8');

code = code.replace(
  "  onOpenCertificates?: () => void;\n}",
  "  onOpenCertificates?: () => void;\n  onOpenIdCard?: () => void;\n}"
);

code = code.replace(
  "  onOpenCertificates\n}) => {",
  "  onOpenCertificates,\n  onOpenIdCard\n}) => {"
);

// Add the ID card button next to or below certificates
const certificatesStr = `              {/* Certificates Action */}
              {onOpenCertificates && (
                <div className={\`p-4 rounded-2xl border flex items-center justify-between gap-4 \${
                  isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/80 border-indigo-200'
                }\`}>
                  <div className="space-y-0.5">
                    <h4 className="font-headline font-bold text-xs flex items-center gap-1.5 text-indigo-400">
                      <span className="material-symbols-outlined text-sm">workspace_premium</span>
                      Academic Certificates
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      View authenticated degree & course credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCertificates();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full transition-all font-mono shrink-0 shadow-xs"
                  >
                    Certificates
                  </button>
                </div>
              )}`;

const replacementStr = certificatesStr + `
              
              {/* ID Card Action */}
              {onOpenIdCard && (
                <div className={\`p-4 rounded-2xl border flex items-center justify-between gap-4 \${
                  isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
                }\`}>
                  <div className="space-y-0.5">
                    <h4 className="font-headline font-bold text-xs flex items-center gap-1.5 text-amber-500">
                      <span className="material-symbols-outlined text-sm">badge</span>
                      Digital ID Card
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      View and download your official student ID.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenIdCard();
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-full transition-all font-mono shrink-0 shadow-xs"
                  >
                    View ID Card
                  </button>
                </div>
              )}`;

code = code.replace(certificatesStr, replacementStr);
fs.writeFileSync('src/components/UserProfileModal.tsx', code);
console.log('Done');
