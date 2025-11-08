import React from 'react';
import '../styles/Textarea.css';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  maxLength,
  rows = 4,
  showCharCount = false,
  dataEasytag
}) => {
  const textareaId = `textarea-${name}`;
  const currentLength = value ? value.length : 0;

  return (
    <div className="textarea-wrapper" data-easytag={dataEasytag}>
      <div className="textarea-label-row" data-easytag={`${dataEasytag}-label-row`}>
        {label && (
          <label htmlFor={textareaId} className="textarea-label" data-easytag={`${dataEasytag}-label`}>
            {label}
            {required && <span className="textarea-required" data-easytag={`${dataEasytag}-required`}>*</span>}
          </label>
        )}
        {showCharCount && maxLength && (
          <span className="textarea-char-count" data-easytag={`${dataEasytag}-char-count`}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={`textarea-field ${error ? 'textarea-error' : ''}`}
        data-easytag={`${dataEasytag}-textarea`}
      />
      {error && (
        <span className="textarea-error-text" data-easytag={`${dataEasytag}-error`}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="textarea-helper-text" data-easytag={`${dataEasytag}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Textarea;
