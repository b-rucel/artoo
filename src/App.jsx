import { Header } from "@/components/Header"
import { FolderTree } from "@/components/FolderTree"
import { FileExplorer } from "@/components/FileExplorer"
import { FileDetails } from "@/components/FileDetails"
import { useState } from "react"

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <FolderTree />
        <FileExplorer onFileSelect={setSelectedFile} />
        <FileDetails file={selectedFile} />
      </div>
    </div>
  )
}

export default App
