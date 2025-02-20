import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Rocket, Palette, Gauge, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"


function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      <div className="max-w-6xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Artoo Explorer
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            A modern file explorer powered by Cloudflare R2
          </p>
        </div>

        {/* File Explorer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - File Tree */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent>
              {/* File tree component will go here */}
              <div className="text-muted-foreground">File tree coming soon...</div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Explorer</CardTitle>
              <CardDescription>
                Your files and folders will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* File grid/list view will go here */}
              <div className="text-muted-foreground">Content area coming soon...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
