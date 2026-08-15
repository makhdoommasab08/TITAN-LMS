const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { StudentQuizzesView } from './components/StudentQuizzesView';",
  "import { StudentQuizzesView } from './components/StudentQuizzesView';\nimport { StudentIDCardModal } from './components/StudentIDCardModal';"
);

code = code.replace(
  "const [isProfileOpen, setIsProfileOpen] = useState(false);",
  "const [isProfileOpen, setIsProfileOpen] = useState(false);\n  const [showIdCard, setShowIdCard] = useState(false);"
);

const oldModal = `<UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        theme={theme}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
      />`;

const newModal = `<UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        theme={theme}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
        onOpenIdCard={() => setShowIdCard(true)}
      />
      
      {showIdCard && (
        <StudentIDCardModal
          studentName={userProfile.name}
          studentId={userProfile.studentId}
          studentEmail={userProfile.email}
          studentAvatar={userProfile.avatar}
          theme={theme}
          onClose={() => setShowIdCard(false)}
        />
      )}`;

code = code.replace(oldModal, newModal);
fs.writeFileSync('src/App.tsx', code);
console.log('App patched!');
