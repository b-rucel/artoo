import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileList } from "@/components/FileList"
import { useState } from "react"
import { formatFileSize } from "@/lib/utils"
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { useFileOperations } from "@/hooks/useFileOperations"
import { FileUpload } from "./FileUpload"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { LogInIcon } from 'lucide-react';

export function FileExplorer({ onFileSelect, onLoginClick }) {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentDirectory, loadDirectory } = useFileOperations();
  const { isAuthenticated } = useAuth();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <main className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">files</h1>
          <div>
            <h2 className="font-semibold">explorer</h2>
            <p className="text-sm text-muted-foreground">
              {currentDirectory.path === '/' ? 'Root directory' : `Directory: ${currentDirectory.path}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <FileUpload />
          ) : (
            <Button variant="outline" onClick={onLoginClick}>
              <LogInIcon className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>

        <div className="border rounded p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <LayoutGridIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 pt-0">
        <Card className="h-full rounded">
          <CardContent className="p-0 h-full">
            <FileList 
              onFileSelect={handleFileSelect} 
              viewMode={viewMode} 
              selectedFilePath={selectedFile?.name}
              currentPath={currentDirectory.path}
              onNavigate={loadDirectory}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}