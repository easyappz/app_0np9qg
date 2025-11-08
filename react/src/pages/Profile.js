import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import Input from '../components/form/Input';
import Button from '../components/form/Button';
import AvatarUploader from '../components/form/AvatarUploader';
import { validateEmail, validatePhone, getErrorMessage } from '../utils/validation';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null
      });
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
    setSuccessMessage('');
  };

  const handleAvatarSelect = (file) => {
    setFormData({
      ...formData,
      avatar: file
    });
    setAvatarPreview(URL.createObjectURL(file));
    setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона (10-15 цифр)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const updatedUser = await updateProfile(formDataToSend);
      updateUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Профиль успешно обновлен');
    } catch (error) {
      console.error('Profile update error:', error);
      const serverErrors = {};
      if (error.response?.data) {
        Object.keys(error.response.data).forEach(key => {
          serverErrors[key] = getErrorMessage(error.response.data[key]);
        });
      }
      setErrors(serverErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: null
    });
    setAvatarPreview(user.avatar_url);
    setErrors({});
    setSuccessMessage('');
  };

  if (!user) {
    return <div data-easytag="id1-react/src/pages/Profile.js">Загрузка...</div>;
  }

  return (
    <div className="profile-page" data-easytag="id2-react/src/pages/Profile.js">
      <div className="profile-container" data-easytag="id3-react/src/pages/Profile.js">
        <div className="profile-header" data-easytag="id4-react/src/pages/Profile.js">
          <h1 className="profile-title" data-easytag="id5-react/src/pages/Profile.js">Мой профиль</h1>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="primary"
              dataEasytag="id6-react/src/pages/Profile.js"
            >
              Редактировать
            </Button>
          )}
        </div>

        {successMessage && (
          <div className="profile-success" role="alert" data-easytag="id7-react/src/pages/Profile.js">
            {successMessage}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form" data-easytag="id8-react/src/pages/Profile.js">
            <AvatarUploader
              currentAvatar={avatarPreview}
              onImageSelect={handleAvatarSelect}
              dataEasytag="id9-react/src/pages/Profile.js"
            />

            <Input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              label="Имя"
              placeholder="Введите имя"
              error={errors.first_name}
              dataEasytag="id10-react/src/pages/Profile.js"
            />

            <Input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              label="Фамилия"
              placeholder="Введите фамилию"
              error={errors.last_name}
              dataEasytag="id11-react/src/pages/Profile.js"
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              placeholder="example@mail.com"
              error={errors.email}
              dataEasytag="id12-react/src/pages/Profile.js"
            />

            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              error={errors.phone}
              dataEasytag="id13-react/src/pages/Profile.js"
            />

            <div className="profile-actions" data-easytag="id14-react/src/pages/Profile.js">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                dataEasytag="id15-react/src/pages/Profile.js"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                disabled={loading}
                dataEasytag="id16-react/src/pages/Profile.js"
              >
                Отмена
              </Button>
            </div>
          </form>
        ) : (
          <div className="profile-view" data-easytag="id17-react/src/pages/Profile.js">
            <div className="profile-avatar-section" data-easytag="id18-react/src/pages/Profile.js">
              <div className="profile-avatar" data-easytag="id19-react/src/pages/Profile.js">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Аватар" className="avatar-image" data-easytag="id20-react/src/pages/Profile.js" />
                ) : (
                  <div className="avatar-placeholder" data-easytag="id21-react/src/pages/Profile.js">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-info" data-easytag="id22-react/src/pages/Profile.js">
              <div className="profile-field" data-easytag="id23-react/src/pages/Profile.js">
                <span className="profile-label" data-easytag="id24-react/src/pages/Profile.js">Имя пользователя:</span>
                <span className="profile-value" data-easytag="id25-react/src/pages/Profile.js">{user.username}</span>
              </div>

              <div className="profile-field" data-easytag="id26-react/src/pages/Profile.js">
                <span className="profile-label" data-easytag="id27-react/src/pages/Profile.js">Имя:</span>
                <span className="profile-value" data-easytag="id28-react/src/pages/Profile.js">
                  {user.first_name} {user.last_name}
                </span>
              </div>

              <div className="profile-field" data-easytag="id29-react/src/pages/Profile.js">
                <span className="profile-label" data-easytag="id30-react/src/pages/Profile.js">Email:</span>
                <span className="profile-value" data-easytag="id31-react/src/pages/Profile.js">{user.email}</span>
              </div>

              {user.phone && (
                <div className="profile-field" data-easytag="id32-react/src/pages/Profile.js">
                  <span className="profile-label" data-easytag="id33-react/src/pages/Profile.js">Телефон:</span>
                  <span className="profile-value" data-easytag="id34-react/src/pages/Profile.js">{user.phone}</span>
                </div>
              )}

              <div className="profile-field" data-easytag="id35-react/src/pages/Profile.js">
                <span className="profile-label" data-easytag="id36-react/src/pages/Profile.js">Дата регистрации:</span>
                <span className="profile-value" data-easytag="id37-react/src/pages/Profile.js">
                  {new Date(user.date_joined).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className="profile-field" data-easytag="id38-react/src/pages/Profile.js">
                <span className="profile-label" data-easytag="id39-react/src/pages/Profile.js">Количество объявлений:</span>
                <span className="profile-value" data-easytag="id40-react/src/pages/Profile.js">{user.listings_count}</span>
              </div>
            </div>

            <div className="profile-link-section" data-easytag="id41-react/src/pages/Profile.js">
              <Link to="/my-listings" className="profile-link" data-easytag="id42-react/src/pages/Profile.js">
                Мои объявления →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;