import React from 'react';

const EmptyTriangle = ({ size, borderWidth, borderColor }) => {
  const triangleStyle = {
    width: `100%`,
    height: `5%`,
    borderLeft: `${size / 2}px solid transparent`,
    borderRight: `${size / 2}px solid transparent`,
    borderTop: `${size}px solid ${borderColor}`,
    borderWidth: `${borderWidth}px`,
    borderColor: borderColor,
    background: borderColor, // Fill with the same color as border color
    position: 'absolute',
    top: '0%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return <div style={triangleStyle}></div>;
};

export default EmptyTriangle;
