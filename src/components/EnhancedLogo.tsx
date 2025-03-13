import React, { useState } from 'react';

interface LogoProps {
  // Customization props
  fontSize?: string;
  letterSpacing?: string;
  primaryColor?: string;
  secondaryColor?: string;
  animationStyle?: 'wave' | 'pulse' | 'fade' | 'none';
  fontWeight?: string;
  className?: string;
  isUppercase?: boolean;
}

const EnhancedChichoreLogoComponent: React.FC<LogoProps> = ({
  fontSize = 'text-4xl',
  letterSpacing = 'tracking-widest',
  primaryColor = 'text-navy-900',
  secondaryColor = 'text-blue-500',
  animationStyle = 'wave',
  fontWeight = 'font-medium',
  className = '',
  isUppercase = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Logo text with proper casing
  const logoText = isUppercase ? "CHICHORÉ" : "Chichoré";
  
  // Split the logo text into individual letters
  const letters = logoText.split('');
  
  // Function to determine the style for each letter
  const getLetterStyle = (index: number) => {
    const isHovered = hoveredIndex === index;
    let letterStyle = `${fontSize} ${fontWeight} transition-all duration-300 transform`;
    
    // Add animation styles
    if (animationStyle === 'wave' && isHovered) {
      letterStyle += ' -translate-y-1';
    } else if (animationStyle === 'pulse' && isHovered) {
      letterStyle += ' scale-125';
    } else if (animationStyle === 'fade' && isHovered) {
      letterStyle += ` ${secondaryColor}`;
    } else {
      letterStyle += ` ${primaryColor}`;
    }
    
    return letterStyle;
  };

  return (
    <div className={`inline-flex items-center ${letterSpacing} ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={getLetterStyle(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            fontFamily: 'serif',
            transition: `all 0.3s ease, transform 0.3s ease ${index * 0.05}s`,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

// Export as both default and named export
export { EnhancedChichoreLogoComponent };
export default EnhancedChichoreLogoComponent;