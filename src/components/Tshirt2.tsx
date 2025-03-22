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

  return (
    <div className="relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="svg1"
        width="796.381"
        height="677.388"
        version="1.1"
        viewBox="0 0 210.709 179.226"
        className="w-full h-full"
      >
        <g id="layer1" transform="translate(-.09 -21.065)">
          <g
            id="g24"
            fill={color}
            fillOpacity="0.98"
            stroke="#000"
            strokeDasharray="none"
            strokeLinejoin="miter"
            strokeOpacity="1"
          >
            <path
              id="path20"
              strokeWidth="1.143"
              d="m44.415 100.762-1.147 98.203 123.83 1.002-1.433-99.456 10.319 6.013 33.25-28.56-39.556-38.83L125.82 22.1c-14.546 10.905-24.401 11.29-43.856-.5L39.813 38.61 1.84 74.898l33.107 31.647 9.184-5.303"
              display="inline"
            ></path>
            <path
              id="path21"
              strokeWidth="0.588"
              d="m43.429 195.249 123.403.482"
              display="inline"
            ></path>
            <path
              id="path22"
              strokeWidth="0.588"
              d="m4.182 72.71 33.13 32.253"
              display="inline"
            ></path>
            <path
              id="path23"
              strokeWidth="0.588"
              d="m174.274 105.056 32.66-29.214"
              display="inline"
            ></path>
            <path
              id="path24"
              strokeWidth="0.588"
              d="m78.36 23.257 3.873-1.73c16.852 10.357 29.997 11.098 43.703.95l3.849 1.462c-17.411 9.94-23.421 16.937-51.425-.682z"
            ></path>
            <path
              id="path25"
              strokeWidth="0.588"
              d="M39.7 38.556c3.347 5.475 5.672 12.165 6.845 20.225q.368 2.525.583 5.231c.818 10.301-.041 22.597-2.8 37.15"
            ></path>
            <path
              id="path25-7"
              strokeWidth="0.588"
              d="M170.09 38.9c-3.347 5.474-5.672 12.164-6.845 20.224a81 81 0 0 0-.583 5.232c-.818 10.3.041 22.596 2.8 37.15"
            ></path>
          </g>
        </g>
      </svg>

      {/* Only render the image overlay if imgSrc is provided */}
      {imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[50%] flex items-center justify-center mt-4"
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
