import React from "react";

interface TShirtProps {
  color: string;
  imgSrc?: string;
  width?: number;
  height?: number;
}

const TShirt = ({ color, imgSrc, width, height }: TShirtProps) => {
  // Calculate aspect ratio to maintain proportions
  const aspectRatio = width && height ? width / height : 1;
  console.log("color is : ", color);

  // Fix the frontImgUrl logic with proper function syntax
  const getFrontImgUrl = () => {
    if (color === "red") {
      return "/tshirt-color/red/red_front.png";
    } else if (color === "dark-blue") {
      return "/tshirt-color/navy-blue/navy_blue_front.png";
    } else if (color === "black") {
      return "/tshirt-color/black/black_front.png";
    } else if (color === "lavender") {
      return "/tshirt-color/white/lavender_front.png";
    } else if (color === "mint-green") {
      return "/tshirt-color/mint-green/mint_green_front.png";
    } else if (color === "light-blue") {
      return "/tshirt-color/light-blue/light_blue_front.png";
    } else if (color === "olive-green") {
      return "/tshirt-color/olive-green/olive_green_front.png";
    } else if (color === "terricotta") {
      return "/tshirt-color/terricotta/terricotta_front.png";
    } else if (color === "berry") {
      return "/tshirt-color/berry/berry_front.png";
    } else {
      return "/tshirt-color/red/white_front.png";
    }
  };

  const frontImgUrl = getFrontImgUrl();
  
  return (
    <div className="relative w-full">
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={frontImgUrl}
          alt="T-shirt front"
          className="w-full h-auto object-contain"
          style={{
            width: width ? `${width}px` : "auto",
            height: height ? `${height}px` : "auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>

      {/* Only render the image overlay if imgSrc is provided */}
      {imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-1/2 flex items-center justify-center mt-4"
            style={{
              // Use actual dimensions and maintain aspect ratio
              aspectRatio: aspectRatio || 1,
              maxWidth: "70%",
              maxHeight: "60%",
            }}
          >
            <img
              src={imgSrc}
              alt="T-shirt design"
              className="w-full h-full object-contain"
              style={{
                width: width ? `${width}px` : "auto",
                height: height ? `${height}px` : "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TShirt;