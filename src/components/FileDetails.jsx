import { FileIcon, FileTextIcon, FileVideoIcon, FileAudioIcon, FileImageIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatFileSize } from "@/lib/utils"
import { fileService } from "@/services/fileService"


export function FileDetails({ file, onClose }) {
  const isImage = file?.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  const isVideo = file?.name?.match(/\.(mp4|webm|mov|avi)$/i);
  const isAudio = file?.name?.match(/\.(mp3|wav|ogg|m4a)$/i);
  const isText = file?.name?.match(/\.(txt|md|json|js|jsx|ts|tsx|css|html)$/i);

  const getFilePreview = () => {
    if (isImage) {
      return (
        <div className="aspect-square w-full overflow-hidden rounded-lg border flex items-center justify-center bg-muted/10">
          <img
            src={`${fileService.baseUrl}/files/${file.name}`}
            alt={file.name}
            className="max-h-full max-w-full object-contain rounded"
          />
        </div>
      );
    }
    if (isVideo) {
      return (
        <div className="aspect-square w-full overflow-hidden rounded-lg border flex items-center justify-center bg-muted/10">
          <video
            src={`${fileService.baseUrl}/files/${file.name}`}
            controls
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
    if (isAudio) {
      return (
        <div className="w-full rounded-lg border p-4">
          <audio
            src={`${fileService.baseUrl}/files/${file.name}`}
            controls
            className="w-full"
          />
        </div>
      );
    }
    return null;
  };

  const getFileIcon = () => {
    if (isImage) return <FileImageIcon className="h-5 w-5 text-muted-foreground" />;
    if (isVideo) return <FileVideoIcon className="h-5 w-5 text-muted-foreground" />;
    if (isAudio) return <FileAudioIcon className="h-5 w-5 text-muted-foreground" />;
    if (isText) return <FileTextIcon className="h-5 w-5 text-muted-foreground" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  };

  if (!file) {
    return (
      <aside className="h-full w-screen md:w-[36rem] border-l p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">details</h2>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
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
    <aside className="h-full w-screen md:w-[36rem] border-l p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getFileIcon()}
          <h2 className="font-semibold">details</h2>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <Card className="rounded">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {getFilePreview()}
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