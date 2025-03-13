import React from 'react';

interface LogoProps {
  // Customization props
  fontSize?: string;
  letterSpacing?: string;
  textColor?: string;
  hoverEffect?: boolean;
  fontWeight?: string;
  className?: string;
  enableAccent?: boolean;
}

const ChichoreLogoComponent: React.FC<LogoProps> = ({
  fontSize = 'text-2xl',
  letterSpacing = 'tracking-wider',
  textColor = 'text-gray-900',
  hoverEffect = true,
  fontWeight = 'font-medium',
  className = '',
  enableAccent = true,
}) => {
  // Base styles for all letters
  const baseStyles = `${fontSize} ${letterSpacing} ${textColor} ${fontWeight} transition-all duration-300`;
  
  // For navbar, use a more subtle hover effect with brand colors
  const letterStyles = {
    C: "hover:text-fuchsia-600",
    H: "hover:text-fuchsia-600",
    I: "hover:text-fuchsia-600",
    C2: "hover:text-fuchsia-600",
    H2: "hover:text-fuchsia-600",
    O: "hover:text-fuchsia-600",
    R: "hover:text-fuchsia-600",
    E: "hover:text-fuchsia-600",
    ACCENT: "text-fuchsia-600",
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.C : ''}`}>C</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.H : ''}`}>H</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.I : ''}`}>I</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.C2 : ''}`}>C</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.H2 : ''}`}>H</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.O : ''}`}>O</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.R : ''}`}>R</span>
      <span className={`${baseStyles} ${hoverEffect ? letterStyles.E : ''}`}>É</span>
      {enableAccent && (
        <span className={`absolute -top-1 -right-1 text-sm ${letterStyles.ACCENT}`}>
          ´
        </span>
      )}
    </div>
  );
};

export default ChichoreLogoComponent;