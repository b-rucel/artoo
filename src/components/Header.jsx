import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, LogIn, LogOut } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/context/AuthContext"
import "./Header.css"
import logo from "../assets/artoo.png"

export function Header({ onFolderTreeToggle, onLoginClick }) {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="border-b relative overflow-hidden">
      <div className="absolute w-[638px] h-[590px] rounded-full blur-[100px] -top-[280px] right-[200px] bg-gradient-yellow"></div>
      <div className="absolute w-[941px] h-[763px] rounded-full blur-[100px] -top-[600px] left-[269px] bg-gradient-pink"></div>
      <div className="absolute w-[803px] h-[655px] rounded-full blur-[100px] -top-[422px] left-[60px] bg-gradient-orange"></div>

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
          {isAuthenticated ? (
            <Button variant="ghost" size="icon" onClick={logout} title="LogOut">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={onLoginClick} title="LogIn">
              <LogIn className="h-5 w-5" />
            </Button>
          )}
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