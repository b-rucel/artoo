import { FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatFileSize } from "@/lib/utils"
import { fileService } from "@/services/fileService"

export function FileDetails({ file }) {
  const isImage = file?.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

  if (!file) {
    return (
      <aside className="w-80 border-l p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">details</h2>
        </div>
        <Card className="rounded">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              select a file to view details
            </div>
          </CardContent>
        </Card>
      </aside>
    )
  }


  return (
    <aside className="w-80 border-l p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold">details</h2>
      </div>
      <Card className="rounded">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {isImage && (
              <div className="aspect-square w-full overflow-hidden rounded-lg border flex items-center justify-center bg-muted/10">
                <img
                  src={`${fileService.baseUrl}/files/${file.name}`}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain rounded"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="mt-1">{file.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Size</label>
              <p className="mt-1">{formatFileSize(file.size)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Path</label>
              <p className="mt-1">{file.path}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 rounded"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `${fileService.baseUrl}/download/${file.name}`;
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded"
                onClick={() => navigator.clipboard.writeText(`${fileService.baseUrl}/files/${file.name}`)}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}