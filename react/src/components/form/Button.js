import React from 'react';
import './Button.css';

const Button = ({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  dataEasytag
}) => {
  const className = `button button-${variant} ${fullWidth ? 'button-full' : ''}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      data-easytag={dataEasytag}
    >
      {children}
    </button>
  );
};

export default Button;