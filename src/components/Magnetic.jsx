import React from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

/**
 * A wrapper component that adds a magnetic hover effect to its single child.
 * @param {React.ReactElement} children - A single React element child.
 * @param {number} max - Maximum distance in pixels to shift the element.
 */
export const Magnetic = ({ children, max = 12 }) => {
  const { style, onMouseMove, onMouseLeave } = useMagnetic(max);
  
  if (!React.isValidElement(children)) {
    return children;
  }

  const child = React.Children.only(children);

  return React.cloneElement(child, {
    style: { ...child.props.style, ...style },
    onMouseMove: (e) => {
      if (child.props.onMouseMove) child.props.onMouseMove(e);
      onMouseMove(e);
    },
    onMouseLeave: (e) => {
      if (child.props.onMouseLeave) child.props.onMouseLeave(e);
      onMouseLeave(e);
    }
  });
};
