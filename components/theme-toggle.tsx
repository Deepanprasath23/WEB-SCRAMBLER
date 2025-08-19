"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Palette className="w-4 h-4 text-primary" />
      </div>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-32 bg-card/80 border-border/50 focus:border-primary/50 focus:ring-primary/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => (
            <SelectItem key={themeOption.value} value={themeOption.value}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${themeOption.colors}`} />
                {themeOption.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
