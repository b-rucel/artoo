import { UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileOperations } from '@/hooks/useFileOperations';

export function FileUpload() {
  const { uploadFiles } = useFileOperations();

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      await uploadFiles(files);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload files"
      />
      <Button variant="outline" className="w-full">
        <UploadIcon className="h-4 w-4 mr-2" />
        Upload Files
      </Button>
    </div>
  );
}