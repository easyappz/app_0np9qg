import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing, getCategories } from '../api/listings';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import '../styles/CreateListingPage.css';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    author_phone: '',
    author_email: '',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        author_phone: user.phone || '',
        author_email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    setHasUnsavedChanges(true);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Название не должно превышать 200 символов';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Описание не должно превышать 5000 символов';
    }

    if (!formData.price) {
      newErrors.price = 'Цена обязательна';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (!formData.author_phone.trim()) {
      newErrors.author_phone = 'Телефон обязателен';
    }

    if (!formData.author_email.trim()) {
      newErrors.author_email = 'Email обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('author_phone', formData.author_phone);
      data.append('author_email', formData.author_email);

      // Add images
      images.forEach((image) => {
        if (image.file) {
          data.append('images', image.file);
        }
      });

      await createListing(data);
      setHasUnsavedChanges(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (error) {
      console.error('Failed to create listing:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Произошла ошибка при создании объявления' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page" data-easytag="id1-react/src/pages/CreateListingPage.js">
      <div className="create-listing-container" data-easytag="id2-react/src/pages/CreateListingPage.js-container">
        <h1 className="create-listing-title" data-easytag="id3-react/src/pages/CreateListingPage.js-title">
          Создать объявление
        </h1>

        {showSuccess && (
          <div className="create-listing-success" data-easytag="id4-react/src/pages/CreateListingPage.js-success">
            Объявление успешно создано и отправлено на модерацию!
          </div>
        )}

        {errors.general && (
          <div className="create-listing-error" data-easytag="id5-react/src/pages/CreateListingPage.js-general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-listing-form" data-easytag="id6-react/src/pages/CreateListingPage.js-form">
          <Input
            label="Название"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название объявления"
            required
            maxLength={200}
            error={errors.title}
            helperText={`${formData.title.length}/200`}
            dataEasytag="id7-react/src/pages/CreateListingPage.js-title-input"
          />

          <Textarea
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Подробно опишите ваше объявление"
            required
            maxLength={5000}
            rows={6}
            showCharCount
            error={errors.description}
            dataEasytag="id8-react/src/pages/CreateListingPage.js-description"
          />

          <Input
            label="Цена"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
            step="0.01"
            error={errors.price}
            helperText="₽"
            dataEasytag="id9-react/src/pages/CreateListingPage.js-price"
          />

          <Select
            label="Категория"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            placeholder="Выберите категорию"
            required
            error={errors.category}
            dataEasytag="id10-react/src/pages/CreateListingPage.js-category"
          />

          <div className="create-listing-contacts" data-easytag="id11-react/src/pages/CreateListingPage.js-contacts">
            <h3 className="create-listing-section-title" data-easytag="id12-react/src/pages/CreateListingPage.js-contacts-title">
              Контактная информация
            </h3>

            <Input
              label="Телефон"
              type="tel"
              name="author_phone"
              value={formData.author_phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              required
              error={errors.author_phone}
              dataEasytag="id13-react/src/pages/CreateListingPage.js-phone"
            />

            <Input
              label="Email"
              type="email"
              name="author_email"
              value={formData.author_email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              error={errors.author_email}
              dataEasytag="id14-react/src/pages/CreateListingPage.js-email"
            />
          </div>

          <ImageUploader
            images={images}
            onChange={handleImagesChange}
            maxImages={5}
            error={errors.images}
            dataEasytag="id15-react/src/pages/CreateListingPage.js-images"
          />

          {images.length === 0 && (
            <p className="create-listing-image-warning" data-easytag="id16-react/src/pages/CreateListingPage.js-image-warning">
              ⚠️ Рекомендуется добавить хотя бы одну фотографию
            </p>
          )}

          <div className="create-listing-actions" data-easytag="id17-react/src/pages/CreateListingPage.js-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
              dataEasytag="id18-react/src/pages/CreateListingPage.js-submit"
            >
              Создать объявление
            </Button>

            <Button
              type="button"
              variant="outline"
              size="large"
              fullWidth
              onClick={() => navigate(-1)}
              disabled={loading}
              dataEasytag="id19-react/src/pages/CreateListingPage.js-cancel"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
