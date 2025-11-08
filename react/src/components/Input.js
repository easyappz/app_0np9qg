import React from 'react';
import '../styles/Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  maxLength,
  min,
  max,
  step,
  accept,
  dataEasytag
}) => {
  const inputId = `input-${name}`;

  return (
    <div className="input-wrapper" data-easytag={dataEasytag}>
      {label && (
        <label htmlFor={inputId} className="input-label" data-easytag={`${dataEasytag}-label`}>
          {label}
          {required && <span className="input-required" data-easytag={`${dataEasytag}-required`}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        accept={accept}
        className={`input-field ${error ? 'input-error' : ''}`}
        data-easytag={`${dataEasytag}-input`}
      />
      {error && (
        <span className="input-error-text" data-easytag={`${dataEasytag}-error`}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="input-helper-text" data-easytag={`${dataEasytag}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
