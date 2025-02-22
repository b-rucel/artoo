import { FolderIcon } from "lucide-react"
import { FileList } from "@/components/FileList"

export function FolderTree() {
  return (
    <aside className="w-64 border-r p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <FolderIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold">Folders</h2>
      </div>
      <FileList view="tree" />
    </aside>
  )
} 