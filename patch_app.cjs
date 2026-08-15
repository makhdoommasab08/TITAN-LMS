const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to add the state for showIdCard in App
// Let's add it right after isProfileOpen
code = code.replace(
  "const [isProfileOpen, setIsProfileOpen] = useState(false);",
  "const [isProfileOpen, setIsProfileOpen] = useState(false);\n  const [showIdCard, setShowIdCard] = useState(false);"
);

// Now we need to pass onOpenIdCard down to UserProfileModal
code = code.replace(
  "onOpenCertificates={() => setIsCertificatesOpen(true)}",
  "onOpenCertificates={() => setIsCertificatesOpen(true)}\n        onOpenIdCard={() => setShowIdCard(true)}"
);

// We need to render the StudentIDCardModal inside App (probably after UserProfileModal)
const modalCode = `
      <UserProfileModal
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

// We can replace the existing UserProfileModal invocation.
// Let's first check how it is invoked.
