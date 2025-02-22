import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileList } from "@/components/FileList"
import { useState } from "react"
import { formatFileSize } from "@/lib/utils"

export function FileExplorer({ onFileSelect }) {
  return (
    <main className="flex-1 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Files</h1>
          <div>
            <h2 className="font-semibold">Explorer</h2>
            <p className="text-sm text-muted-foreground">Your files and folders will appear here</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-1">
        <Card className="flex-1">
          <CardContent>
            <FileList onFileSelect={onFileSelect} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 