import { Header } from "@/components/Header"
import { FolderTree } from "@/components/FolderTree"
import { FileExplorer } from "@/components/FileExplorer"
import { FileDetails } from "@/components/FileDetails"
import { useState } from "react"

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFolderTree, setShowFolderTree] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onFolderTreeToggle={() => setShowFolderTree(!showFolderTree)}
        onFileDetailsToggle={() => setShowFileDetails(!showFileDetails)}
      />
      <div className="flex relative h-[calc(100vh-3.5rem)]">
        <div className={`
          fixed md:relative left-0 z-30 h-full bg-background
          transition-transform duration-200 ease-in-out
          ${showFolderTree ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <FolderTree currentPath="/" />
        </div>

        <div className="flex-1 relative">
          <FileExplorer
            onFileSelect={(file) => {
              setSelectedFile(file);
              setShowFileDetails(true);
            }}
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
    </div>
  )
}

export default App
