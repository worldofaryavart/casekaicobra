import React from 'react';

const TShirt = ({ color }: { color: string }) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    id="svg1"
    width="796.381"
    height="677.388"
    version="1.1"
    viewBox="0 0 210.709 179.226"
    className='w-full h-full'
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
  );
};

export default TShirt;
