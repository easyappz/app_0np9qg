import React, { useState, useRef, useCallback } from 'react';
import '../styles/ImageUploader.css';

const ImageUploader = ({
  images = [],
  onChange,
  maxImages = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  error,
  dataEasytag
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];

    if (!acceptedFormats.includes(file.type)) {
      errors.push(`${file.name}: Неподдерживаемый формат. Допустимы: JPG, PNG, WEBP`);
    }

    if (file.size > maxFileSize) {
      errors.push(`${file.name}: Файл слишком большой. Максимум ${maxFileSize / 1024 / 1024}MB`);
    }

    return errors;
  };

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const errors = [];
    const validFiles = [];

    // Check total count
    if (images.length + fileArray.length > maxImages) {
      errors.push(`Максимальное количество изображений: ${maxImages}`);
      setUploadErrors(errors);
      return;
    }

    // Validate each file
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        errors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    setUploadErrors(errors);

    if (validFiles.length > 0) {
      // Create preview URLs and add to images
      const newImages = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true
      }));
      onChange([...images, ...newImages]);
    }
  }, [images, maxImages, onChange]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (fromIndex !== index) {
      handleReorder(fromIndex, index);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader-wrapper" data-easytag={dataEasytag}>
      <label className="image-uploader-label" data-easytag={`${dataEasytag}-label`}>
        Фотографии
        <span className="image-uploader-count" data-easytag={`${dataEasytag}-count`}>
          ({images.length}/{maxImages})
        </span>
      </label>

      {images.length < maxImages && (
        <div
          className={`image-uploader-drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          data-easytag={`${dataEasytag}-drop-zone`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="image-uploader-input"
            data-easytag={`${dataEasytag}-input`}
          />
          <div className="image-uploader-icon" data-easytag={`${dataEasytag}-icon`}>📷</div>
          <p className="image-uploader-text" data-easytag={`${dataEasytag}-text`}>
            Перетащите изображения сюда или нажмите для выбора
          </p>
          <p className="image-uploader-hint" data-easytag={`${dataEasytag}-hint`}>
            JPG, PNG, WEBP до {maxFileSize / 1024 / 1024}MB
          </p>
        </div>
      )}

      {uploadErrors.length > 0 && (
        <div className="image-uploader-errors" data-easytag={`${dataEasytag}-errors`}>
          {uploadErrors.map((err, index) => (
            <div key={index} className="image-uploader-error" data-easytag={`${dataEasytag}-error-${index}`}>
              {err}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="image-uploader-error" data-easytag={`${dataEasytag}-main-error`}>
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="image-uploader-previews" data-easytag={`${dataEasytag}-previews`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="image-preview"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              data-easytag={`${dataEasytag}-preview-${index}`}
            >
              <img
                src={image.preview || image.image_url}
                alt={`Preview ${index + 1}`}
                className="image-preview-img"
                data-easytag={`${dataEasytag}-preview-img-${index}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="image-preview-remove"
                data-easytag={`${dataEasytag}-remove-${index}`}
              >
                ✕
              </button>
              <div className="image-preview-order" data-easytag={`${dataEasytag}-order-${index}`}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="image-uploader-reorder-hint" data-easytag={`${dataEasytag}-reorder-hint`}>
          Перетаскивайте изображения для изменения порядка
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
