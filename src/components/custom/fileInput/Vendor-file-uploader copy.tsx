import * as React from "react";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import { useMutation } from "@apollo/client";
import { useControllableState } from "./helper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DropzoneContent from "./dropzoneContent";
import { FileCard, IsFileWithPreview } from "./filecard";
import { VENDOR_UPLOAD_MUTATION } from "./gql/mutation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  accepts?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  maxFiles?: DropzoneProps["maxFiles"];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  progresses?: Record<string, number>;
}

export function VendorFileUploader({
  value: valueProp,
  onValueChange,
  accepts = { "image/*": [] },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 7,
  multiple = true,
  disabled = false,
  className,
  progresses,
  ...dropzoneProps
}: FileUploaderProps) {
  const { toast } = useToast();
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  }); 
  const [vendorUpload] = useMutation(VENDOR_UPLOAD_MUTATION);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast({
          title: "File Limit Exceeded",
          description: `Cannot upload more than ${maxFiles} files`,
          action: <ToastAction altText="Undo">Undo</ToastAction>,
        });
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = [...(files ?? []), ...newFiles];
      setFiles(updatedFiles);

      rejectedFiles.forEach(({ file }) => {
        toast({
          title: "File Rejected",
          description: `File ${file.name} was rejected`,
          action: <ToastAction altText="Undo">Undo</ToastAction>,
        });
      });
    },
    [files, maxFiles, setFiles, toast]
  );

  const handleUpload = async () => {
    toast({
      title: "Upload Failed",
      description: `Failed to upload files:  'Unknown error'}`,
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    });
    if ((files?.length ?? 0) > 0) {
      try {
        const { data } = await vendorUpload({ variables: { files } });
console.log(data);

        if (data) {
          setFiles([]);
          toast({
            title: "Upload Successful",
            description: `Files uploaded successfully`,
            action: <ToastAction altText="Undo">Undo</ToastAction>,
          });
        }
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`,
          action: <ToastAction altText="Undo">Undo</ToastAction>,
        });
      }
    }
  };

  const onRemove = (index: number) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  };

  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (IsFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Button
        className="w-[20%]"
        onClick={handleUpload}
        disabled={isDisabled}
      >
        Send
      </Button>
      <Dropzone
        onDrop={onDrop}
        accept={accepts}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={isDisabled}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <DropzoneContent
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            isDisabled={isDisabled}
            className={className}
            maxFiles={maxFiles}
            maxSize={maxSize}
            dropzoneProps={dropzoneProps}
          />
        )}
      </Dropzone>
      {files?.length > 0 && (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files?.map((file, index) => (
              <FileCard
                key={file.name + index} // Better to use a unique key
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
