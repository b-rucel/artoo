import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, FolderIcon, FileIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { FileList } from "@/components/FileList"

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="border-b">
        <div className="flex items-center justify-between px-6 h-14">
          <h1 className="text-2xl font-semibold tracking-tight">
            artoo
            <Badge variant="secondary" className="ml-2 text-xs">beta</Badge>
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Folder Tree Section */}
        <aside className="w-64 border-r p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Folders</h2>
          </div>
          <FileList view="tree" />
        </aside>

        {/* Main Content Section */}
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              Files
              <Badge variant="secondary" className="ml-2">Beta</Badge>
            </h1>
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Explorer</CardTitle>
              <CardDescription>
                Your files and folders will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileList view="grid" />
            </CardContent>
          </Card>
        </main>

        {/* Details Section */}
        <aside className="w-80 border-l p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Details</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1">selected-file.pdf</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Size</label>
                  <p className="mt-1">2.4 MB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modified</label>
                  <p className="mt-1">Apr 12, 2024</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Download</Button>
                  <Button size="sm" variant="outline" className="flex-1">Share</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default App
