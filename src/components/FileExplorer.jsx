import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileList } from "@/components/FileList"

export function FileExplorer() {
  return (
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
          {/* <FileList view="grid" /> */}
        </CardContent>
      </Card>
    </main>
  )
} 