import { useState } from 'react';

/**
 * Custom hook to add a cursor-following magnetic effect to elements on hover.
 * @param {number} maxTranslation - Maximum distance in pixels the element can translate.
 */
export const useMagnetic = (maxTranslation = 12) => {
  const [style, setStyle] = useState({});

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Get mouse coordinates relative to the element's center
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    
    // Calculate translation based on mouse distance from the center
    const xTrans = (mouseX / (rect.width / 2)) * maxTranslation;
    const yTrans = (mouseY / (rect.height / 2)) * maxTranslation;
    
    setStyle({
      transform: `translate(${xTrans}px, ${yTrans}px)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const onMouseLeave = () => {
    setStyle({
      transform: 'translate(0px, 0px)',
      transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
    });
  };

  return {
    style,
    onMouseMove,
    onMouseLeave
  };
};
