"use client";

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";
import TShirt from "@/components/Tshirt2";
import type { TshirtColor, TshirtSize, TshirtFabric } from "@prisma/client";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
  colors: TshirtColor[];
  sizes: TshirtSize[];
  fabrics: TshirtFabric[];
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
  colors,
  sizes,
  fabrics,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // Log props to verify they are passed correctly
  console.log("DesignConfiguratorProps", configId, imageUrl, imageDimensions);

  const { mutate: saveConfig, status } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });
  
  const isPending = status === "pending";

  // Initialize options with the first available option from each array
  const [options, setOptions] = useState<{
    color: TshirtColor;
    size: TshirtSize;
    fabric: TshirtFabric;
  }>({
    color: colors[0],
    size: sizes[0],
    fabric: fabrics[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const tshirtRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    try {
      const {
        left: tshirtLeft,
        top: tshirtTop,
        width,
        height,
      } = tshirtRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = tshirtLeft - containerLeft;
      const topOffset = tshirtTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  console.log("colors is : ", options.color);

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          className="absolute z-50 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          <div className="relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
        
        {/* Main TShirt display area - FIXED */}
        <div 
          ref={tshirtRef}
          className="relative w-4/5 h-4/5 flex items-center justify-center pointer-events-none"
        >
          <TShirt 
            color={options.color.value || "mint-green"} 
            width={500} 
            height={600} 
          />
        </div>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your T‑shirt
            </h2>
            <div className="w-full h-px bg-zinc-200 my-6" />
            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                {/* Color Selection */}
                <div className="flex flex-col gap-3">
                  <Label>Color: {options.color.label}</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() =>
                          setOptions((prev) => ({ ...prev, color }))
                        }
                        className={cn(
                          "relative flex cursor-pointer items-center justify-center rounded-full p-0.5 border-2 border-transparent hover:border-gray-400 transition-all",
                          {
                            "border-black": color.id === options.color.id,
                          }
                        )}
                        aria-label={color.label}
                      >
                        <span
                          className="h-8 w-8 rounded-full border border-black border-opacity-10"
                          style={{ backgroundColor: color.hex || "#000" }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    <Label className="mr-3 text-sm">Custom:</Label>
                    <input
                      type="color"
                      value={options.color.hex || "#000000"}
                      onChange={(e) => {
                        // For custom color, we update the current color.
                        // We assume "black" is always available.
                        const blackOption =
                          colors.find((c) => c.value === "black") || colors[0];
                        setOptions((prev) => ({
                          ...prev,
                          color: { ...blackOption, hex: e.target.value },
                        }));
                      }}
                      className="h-8 w-8 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Size Selection */}
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Size</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.size.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {sizes.map((size) => (
                        <DropdownMenuItem
                          key={size.id}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            { "bg-zinc-100": size.id === options.size.id }
                          )}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, size }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              size.id === options.size.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {size.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Fabric Selection */}
                <RadioGroup
                  value={options.fabric}
                  onChange={(val) =>
                    setOptions((prev) => ({ ...prev, fabric: val }))
                  }
                >
                  <Label>Fabric</Label>
                  <div className="mt-3 space-y-4">
                    {fabrics.map((option) => (
                      <RadioGroup.Option
                        key={option.id}
                        value={option}
                        className={({ active, checked }) =>
                          cn(
                            "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                            { "border-primary": active || checked }
                          )
                        }
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label
                              className="font-medium text-gray-900"
                              as="span"
                            >
                              {option.label}
                            </RadioGroup.Label>
                            {option.price !== null && (
                              <RadioGroup.Description
                                as="span"
                                className="text-gray-500"
                              >
                                {option.price !== undefined &&
                                  formatPrice(option.price)}
                              </RadioGroup.Description>
                            )}
                          </span>
                        </span>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + (options.fabric.price || 0)*100) / 100
                )}
              </p>
              <Button
                isLoading={isPending}
                disabled={isPending}
                loadingText="Saving"
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color,
                    size: options.size,
                    fabric: options.fabric,
                  })
                }
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;