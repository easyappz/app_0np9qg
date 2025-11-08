import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateListing, getListingById, getCategories } from '../api/listings';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import '../styles/EditListingPage.css';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingListing, setFetchingListing] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [listing, setListing] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    author_phone: '',
    author_email: '',
  });

  const [images, setImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingData, categoriesData] = await Promise.all([
          getListingById(id),
          getCategories()
        ]);

        // Check if user is the author
        if (listingData.author.id !== user?.id) {
          navigate('/');
          return;
        }

        setListing(listingData);
        setCategories(categoriesData);

        setFormData({
          title: listingData.title,
          description: listingData.description,
          price: listingData.price,
          category: listingData.category.id,
          author_phone: listingData.author_phone,
          author_email: listingData.author_email,
        });

        // Set existing images
        setImages(listingData.images.map(img => ({
          id: img.id,
          image_url: img.image_url,
          preview: img.image_url,
          isNew: false
        })));
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        navigate('/my-listings');
      } finally {
        setFetchingListing(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagesChange = (newImages) => {
    // Track deleted images
    const currentImageIds = images.filter(img => !img.isNew).map(img => img.id);
    const newImageIds = newImages.filter(img => !img.isNew).map(img => img.id);
    const deletedIds = currentImageIds.filter(id => !newImageIds.includes(id));
    
    setDeleteImageIds(prev => [...new Set([...prev, ...deletedIds])]);
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

      // Add new images
      images.forEach((image) => {
        if (image.isNew && image.file) {
          data.append('images', image.file);
        }
      });

      // Add deleted image IDs
      if (deleteImageIds.length > 0) {
        deleteImageIds.forEach(id => {
          data.append('delete_image_ids', id);
        });
      }

      await updateListing(id, data);
      setHasUnsavedChanges(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (error) {
      console.error('Failed to update listing:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Произошла ошибка при обновлении объявления' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingListing) {
    return (
      <div className="edit-listing-loading" data-easytag="id1-react/src/pages/EditListingPage.js-loading">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="edit-listing-page" data-easytag="id2-react/src/pages/EditListingPage.js">
      <div className="edit-listing-container" data-easytag="id3-react/src/pages/EditListingPage.js-container">
        <h1 className="edit-listing-title" data-easytag="id4-react/src/pages/EditListingPage.js-title">
          Редактировать объявление
        </h1>

        {listing?.status === 'pending' && (
          <div className="edit-listing-notice" data-easytag="id5-react/src/pages/EditListingPage.js-pending-notice">
            ℹ️ Это объявление находится на модерации
          </div>
        )}

        {showSuccess && (
          <div className="edit-listing-success" data-easytag="id6-react/src/pages/EditListingPage.js-success">
            Объявление успешно обновлено и отправлено на модерацию!
          </div>
        )}

        {errors.general && (
          <div className="edit-listing-error" data-easytag="id7-react/src/pages/EditListingPage.js-general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-listing-form" data-easytag="id8-react/src/pages/EditListingPage.js-form">
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
            dataEasytag="id9-react/src/pages/EditListingPage.js-title-input"
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
            dataEasytag="id10-react/src/pages/EditListingPage.js-description"
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
            dataEasytag="id11-react/src/pages/EditListingPage.js-price"
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
            dataEasytag="id12-react/src/pages/EditListingPage.js-category"
          />

          <div className="edit-listing-contacts" data-easytag="id13-react/src/pages/EditListingPage.js-contacts">
            <h3 className="edit-listing-section-title" data-easytag="id14-react/src/pages/EditListingPage.js-contacts-title">
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
              dataEasytag="id15-react/src/pages/EditListingPage.js-phone"
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
              dataEasytag="id16-react/src/pages/EditListingPage.js-email"
            />
          </div>

          <ImageUploader
            images={images}
            onChange={handleImagesChange}
            maxImages={5}
            error={errors.images}
            dataEasytag="id17-react/src/pages/EditListingPage.js-images"
          />

          {images.length === 0 && (
            <p className="edit-listing-image-warning" data-easytag="id18-react/src/pages/EditListingPage.js-image-warning">
              ⚠️ Рекомендуется добавить хотя бы одну фотографию
            </p>
          )}

          <div className="edit-listing-actions" data-easytag="id19-react/src/pages/EditListingPage.js-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
              dataEasytag="id20-react/src/pages/EditListingPage.js-submit"
            >
              Сохранить изменения
            </Button>

            <Button
              type="button"
              variant="outline"
              size="large"
              fullWidth
              onClick={() => navigate(-1)}
              disabled={loading}
              dataEasytag="id21-react/src/pages/EditListingPage.js-cancel"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
