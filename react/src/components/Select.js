import React from 'react';
import '../styles/Select.css';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Выберите...',
  required = false,
  error,
  helperText,
  disabled = false,
  dataEasytag
}) => {
  const selectId = `select-${name}`;

  return (
    <div className="select-wrapper" data-easytag={dataEasytag}>
      {label && (
        <label htmlFor={selectId} className="select-label" data-easytag={`${dataEasytag}-label`}>
          {label}
          {required && <span className="select-required" data-easytag={`${dataEasytag}-required`}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select-field ${error ? 'select-error' : ''}`}
        data-easytag={`${dataEasytag}-select`}
      >
        <option value="" data-easytag={`${dataEasytag}-option-placeholder`}>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={option.value || index}
            value={option.value}
            data-easytag={`${dataEasytag}-option-${index}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="select-error-text" data-easytag={`${dataEasytag}-error`}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="select-helper-text" data-easytag={`${dataEasytag}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Select;
