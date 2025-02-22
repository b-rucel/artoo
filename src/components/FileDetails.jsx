import { FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FileDetails() {
  return (
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
  )
} 