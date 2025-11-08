import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  autoComplete,
  dataEasytag
}) => {
  return (
    <div className="input-wrapper" data-easytag={dataEasytag}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span className="input-error-message" id={`${name}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;