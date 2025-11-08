import React from 'react';
import '../styles/Button.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'medium',
  dataEasytag
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      data-easytag={dataEasytag}
    >
      {loading ? (
        <span className="button-spinner" data-easytag={`${dataEasytag}-spinner`}></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
