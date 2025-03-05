import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import logo from "../assets/artoo.png"

export function Header({ onFolderTreeToggle }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b relative overflow-hidden">
      <div className="flex items-center justify-between px-6 h-14 relative z-10">
        <button
          onClick={onFolderTreeToggle}
          className="md:pointer-events-none"
        >
          <h1 className="text-2xl font-semibold tracking-tight flex items-center">
            <img src={logo} alt="Artoo Logo" className="h-10 mr-2" /> artoo
            <Badge variant="secondary" className="ml-2 text-xs">beta</Badge>
          </h1>
        </button>
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
  )
}