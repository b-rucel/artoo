import { Header } from "@/components/Header"
import { FolderTree } from "@/components/FolderTree"
import { FileExplorer } from "@/components/FileExplorer"
import { FileDetails } from "@/components/FileDetails"
import { Login } from "@/components/Login"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFolderTree, setShowFolderTree] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);  // Add this line

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onFolderTreeToggle={() => setShowFolderTree(!showFolderTree)}
        onFileDetailsToggle={() => setShowFileDetails(!showFileDetails)}
        onLoginClick={() => setShowLoginDialog(true)}
      />
      <div className="flex relative h-[calc(100vh-3.5rem)]">
        <div className={`
          fixed md:relative left-0 z-30 h-full bg-background
          transition-transform duration-200 ease-in-out
          ${showFolderTree ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <FolderTree
            currentPath="/"
            onNavigate={() => setShowFolderTree(false)}
          />
        </div>

        <div className="flex-1 relative">
          <FileExplorer
            onFileSelect={(file) => {
              setSelectedFile(file);
              setShowFileDetails(true);
            }}
            onLoginClick={() => setShowLoginDialog(true)}
          />
        </div>

        <div className={`
          fixed md:relative right-0 z-30 h-full bg-background
          transition-transform duration-200 ease-in-out
          ${showFileDetails ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <FileDetails
            file={selectedFile}
            onClose={() => setShowFileDetails(false)}
          />
        </div>
      </div>

      {showLoginDialog && (
        <div className="fixed inset-0 bg-background z-50">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <Login
              onSuccess={() => setShowLoginDialog(false)}
              onCancel={() => setShowLoginDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
