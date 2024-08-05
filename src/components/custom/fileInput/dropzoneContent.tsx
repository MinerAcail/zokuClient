import React from 'react';
import { DropzoneState } from 'react-dropzone';

import { formatBytes } from './helper';
import { cn } from '@/lib/utils';

import {  UploadIcon } from "@radix-ui/react-icons";

interface DropzoneContentProps {
  getRootProps: DropzoneState['getRootProps'];
  getInputProps: DropzoneState['getInputProps'];
  isDragActive: boolean;
  isDisabled: boolean;
  className?: string;
  maxFiles: number;
  maxSize: number;
  dropzoneProps: object;
}

const DropzoneContent: React.FC<DropzoneContentProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDisabled,
  className,
  maxFiles,
  maxSize,
  dropzoneProps
}) => (
  <div
    {...getRootProps({
      className: cn(
        "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragActive && "border-muted-foreground/50",
        isDisabled && "pointer-events-none opacity-60",
        className
      ),
      ...dropzoneProps
    })}
  >
    <input {...getInputProps()} />
    {isDragActive ? (
      <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
        <div className="rounded-full border border-dashed p-3">
          <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="font-medium text-muted-foreground">Drop the files here</p>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
        <div className="rounded-full border border-dashed p-3">
          <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-px">
          <p className="font-medium text-muted-foreground">
            Drag '\'n\' drop files here, or click to select files
          </p>
          <p className="text-sm text-muted-foreground/70">
            You can upload
            {maxFiles > 1
              ? ` ${maxFiles === Infinity ? "multiple" : maxFiles} files (up to ${formatBytes(maxSize)} each)`
              : ` a file with ${formatBytes(maxSize)}`}
          </p>
        </div>
      </div>
    )}
  </div>
);

export default DropzoneContent;
