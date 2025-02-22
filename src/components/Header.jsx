import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
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
  )
} 