import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/form/Input';
import Button from '../components/form/Button';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validatePasswordMatch,
  getErrorMessage
} from '../utils/validation';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.username)) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email обязателен';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Пароль обязателен';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!validatePasswordMatch(formData.password, formData.password_confirm)) {
      newErrors.password_confirm = 'Пароли не совпадают';
    }

    if (!validateRequired(formData.first_name)) {
      newErrors.first_name = 'Имя обязательно';
    }

    if (!validateRequired(formData.last_name)) {
      newErrors.last_name = 'Фамилия обязательна';
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
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      const serverErrors = {};
      if (result.errors) {
        Object.keys(result.errors).forEach(key => {
          serverErrors[key] = getErrorMessage(result.errors[key]);
        });
      }
      setErrors(serverErrors);
    }
  };

  return (
    <div className="auth-page" data-easytag="id1-react/src/pages/Register.js">
      <div className="auth-container" data-easytag="id2-react/src/pages/Register.js">
        <div className="auth-header" data-easytag="id3-react/src/pages/Register.js">
          <h1 className="auth-title" data-easytag="id4-react/src/pages/Register.js">Регистрация</h1>
          <p className="auth-subtitle" data-easytag="id5-react/src/pages/Register.js">
            Создайте новый аккаунт
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" data-easytag="id6-react/src/pages/Register.js">
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            error={errors.username}
            required
            autoComplete="username"
            dataEasytag="id7-react/src/pages/Register.js"
          />

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            placeholder="example@mail.com"
            error={errors.email}
            required
            autoComplete="email"
            dataEasytag="id8-react/src/pages/Register.js"
          />

          <Input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            label="Имя"
            placeholder="Введите имя"
            error={errors.first_name}
            required
            autoComplete="given-name"
            dataEasytag="id9-react/src/pages/Register.js"
          />

          <Input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            label="Фамилия"
            placeholder="Введите фамилию"
            error={errors.last_name}
            required
            autoComplete="family-name"
            dataEasytag="id10-react/src/pages/Register.js"
          />

          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
            error={errors.phone}
            autoComplete="tel"
            dataEasytag="id11-react/src/pages/Register.js"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Пароль"
            placeholder="Минимум 8 символов"
            error={errors.password}
            required
            autoComplete="new-password"
            dataEasytag="id12-react/src/pages/Register.js"
          />

          <Input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            label="Подтвердите пароль"
            placeholder="Повторите пароль"
            error={errors.password_confirm}
            required
            autoComplete="new-password"
            dataEasytag="id13-react/src/pages/Register.js"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            dataEasytag="id14-react/src/pages/Register.js"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="auth-footer" data-easytag="id15-react/src/pages/Register.js">
          <p data-easytag="id16-react/src/pages/Register.js">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link" data-easytag="id17-react/src/pages/Register.js">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;