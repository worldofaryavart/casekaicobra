import React from 'react';

const TShirt = ({ color }: { color: string }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Main t-shirt shape */}
      <path 
        d="
          M80,20 
          L50,50 
          L40,80 
          L30,100 
          L30,150 
          L170,150 
          L170,100 
          L160,80 
          L150,50 
          L120,20 
          Q100,0 80,20 
          Z
        "
        fill={color}
        stroke="gray"
        strokeWidth="2"
      />
      
      {/* Wrinkles/highlights */}
      <line 
        x1="45" 
        y1="70" 
        x2="45" 
        y2="90" 
        stroke="white" 
        strokeWidth="2" 
        opacity="0.2" 
        strokeLinecap="round"
      />
      <line 
        x1="155" 
        y1="70" 
        x2="155" 
        y2="90" 
        stroke="white" 
        strokeWidth="2" 
        opacity="0.2" 
        strokeLinecap="round"
      />
      
      {/* Bottom hem */}
      <rect 
        x="30" 
        y="145" 
        width="140" 
        height="5" 
        fill="black" 
        opacity="0.1" 
        rx="2" 
      />
    </svg>
  );
};

export default TShirt;
