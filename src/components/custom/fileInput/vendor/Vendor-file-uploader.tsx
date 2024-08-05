import * as React from "react";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DropzoneContent from "../dropzoneContent";
import { FileCard, IsFileWithPreview } from "../filecard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useControllableState } from "../helper";
import { VENDOR_UPLOAD_MUTATION } from "../gql/mutation";
import { useMutation } from "@apollo/client";

// Define the form schema
const accountFormSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  state: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
});

export type VendorFormValues = z.infer<typeof accountFormSchema>;

// Default values for the form fields
const defaultValues: Partial<VendorFormValues> = {
  name: "",
  brand: "",
  price: "",
  state: "",
  description: "",
};

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

export function VendorFileUploader(props: FileUploaderProps) {
  const {
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
  } = props;
  const [vendorUpload] = useMutation(VENDOR_UPLOAD_MUTATION);

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,  
  });
  const [formData, setFormData] = React.useState<Partial<VendorFormValues>>({});

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{
    title: string;
    description: string;
    action?: () => void;
  } | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const { handleSubmit, control } = form;

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        setDialogContent({
          title: "Upload Limit Exceeded",
          description: `Cannot upload more than ${maxFiles} files`,
          action: () => setDialogOpen(false),
        });
        setDialogOpen(true);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = [...(files ?? []), ...newFiles];

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          setDialogContent({
            title: "File Rejected",
            description: `File ${file.name} was rejected`,
            action: () => setDialogOpen(false),
          });
          setDialogOpen(true);
        });
      }
    },
    [files, maxFiles, setFiles]
  );

  const handleUpload = async () => {
    if ((files?.length ?? 0) > 0) {
      try {

      console.log("variables", {
            files: files,
            input: {
              name: formData.name,
              title: formData.description,
              state: formData.state,
              brand: formData.brand,
              price: formData.price,
            },
          },);
      
        const { data } = await vendorUpload({
          variables: {
            files: files,
            input: {
              name: formData.name,
              title: formData.description,
              state: formData.state,
              brand: formData.brand,
              price: formData.price,
            },
          },
        });

        console.log("data",data);
        

        if (data) {
          setFiles([]);
          setDialogContent({
            title: "Upload Successful",
            description: `Files uploaded successfully`,
            action: () => setDialogOpen(false),
          });
          setDialogOpen(true);
        }

      } catch (error) {
        setDialogContent({
          title: "Upload Failed",
          description: `Failed to upload files`,
          action: () => setDialogOpen(false),
        });
        setDialogOpen(true);
      }
    }
  };

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

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

  const onSubmit = async (data: VendorFormValues) => {
    setFormData(data);
    console.log(data);
    await handleUpload();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="w-full sm:w-1/2 m-auto flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">State</FormLabel>
                  <FormControl>
                    <Input placeholder="Product State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-[20%]"
              disabled={isDisabled}
            >
              Send
            </Button>
          </form>
        </Form>

        <Dropzone
          onDrop={onDrop}
          accept={accepts}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={multiple}
          disabled={isDisabled}
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

        {files?.length ? (
          <ScrollArea className="h-fit w-full px-3">
            <div className="max-h-48 space-y-4">
              {files?.map((file, index) => (
                <FileCard
                  key={file.name + index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          </ScrollArea>
        ) : null}

        {/* Alert Dialog */}
        {dialogOpen && dialogContent && (
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={dialogContent.action}>
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
