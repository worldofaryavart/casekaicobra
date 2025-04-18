"use client";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@radix-ui/react-progress";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import axios, { AxiosRequestConfig } from "axios";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Cloudinary helper
  const uploadToCloudinary = async (
    file: File,
    onProgress?: (progressPercent: number) => void
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "chichore_preset"
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("Missing Cloudinary cloud name");
    }

    const config: AxiosRequestConfig = {
      onUploadProgress(event) {
        if (event.total && onProgress) {
          const pct = Math.round((event.loaded * 100) / event.total);
          onProgress(pct);
        }
      },
    };

    const res = await axios.post<{
      secure_url: string;
    }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      config
    );

    return res.data.secure_url;
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    setIsDragOver(false);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // if you only allow one file, you can do acceptedFiles[0]
      const urls = await Promise.all(
        acceptedFiles.map((file) =>
          uploadToCloudinary(file, (p) => setUploadProgress(p))
        )
      );

      // navigate to your design page with the first URL
      const imageUrl = encodeURIComponent(urls[0]);
      startTransition(() => {
        router.push(`/configure/design?imageUrl=${imageUrl}`);
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDropRejected = (rejected: FileRejection[]) => {
    setIsDragOver(false);
    const file = rejected[0].file;
    toast({
      title: `${file.type} not supported`,
      description: "Please choose a PNG, JPG, or JPEG image instead.",
      variant: "destructive",
    });
  };

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-900/10": isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}

              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading…</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait…</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {!isPending && (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Page;
