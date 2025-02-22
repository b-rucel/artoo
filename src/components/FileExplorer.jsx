import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileList } from "@/components/FileList"

export function FileExplorer() {
  return (
    <main className="flex-1 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="pl-2">
            <h2 className="font-semibold">Explorer</h2>
            <p className="text-sm text-muted-foreground">Your files and folders will appear here</p>
          </div>
        </div>
      </div>
      <Card className="flex-1">
        <CardContent className="p-0">
          <FileList view="grid" />
        </CardContent>
      </Card>
    </main>
  )
} 