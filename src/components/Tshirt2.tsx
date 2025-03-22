import React from 'react';

interface TShirtProps {
  color: string;
  imgSrc: string;
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
        id="svg1"
        width="796.381"
        height="677.388"
        version="1.1"
        viewBox="0 0 210.709 179.226"
        className="w-full h-full"
      >
        <g id="layer1" transform="translate(-.09 -21.065)">
          <path
            id="path19"
            fill={color}
            fillOpacity="0.98"
            stroke="#000"
            strokeDasharray="none"
            strokeLinejoin="miter"
            strokeOpacity="1"
            strokeWidth="0.588"
            d="M76.293 21.4.955 59.686.39 112.589l39.644-21.905.566 109.31 130.257-1.15-.566-108.16 40.21 21.905-.582-52.352L135.772 21.4c-18.202 10.379-39.526 11.784-59.479 0z"
          ></path>
        </g>
      </svg>
      
      {/* Image overlay on t-shirt with proper dimensions */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[50%] flex items-center justify-center mt-4"
          style={{
            // Use actual dimensions and maintain aspect ratio
            aspectRatio: aspectRatio || 1,
            maxWidth: '70%', 
            maxHeight: '60%'
          }}
        >
          {imgSrc && 
            <img 
              src={imgSrc} 
              alt="T-shirt design" 
              className="w-full h-full object-contain"
              style={{ 
                width: width ? `${width}px` : 'auto',
                height: height ? `${height}px` : 'auto',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default TShirt;