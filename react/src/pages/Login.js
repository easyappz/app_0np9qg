import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/form/Input';
import Button from '../components/form/Button';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page" data-easytag="id1-react/src/pages/Login.js">
      <div className="auth-container" data-easytag="id2-react/src/pages/Login.js">
        <div className="auth-header" data-easytag="id3-react/src/pages/Login.js">
          <h1 className="auth-title" data-easytag="id4-react/src/pages/Login.js">Вход</h1>
          <p className="auth-subtitle" data-easytag="id5-react/src/pages/Login.js">
            Войдите в свой аккаунт
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert" data-easytag="id6-react/src/pages/Login.js">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" data-easytag="id7-react/src/pages/Login.js">
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            required
            autoComplete="username"
            dataEasytag="id8-react/src/pages/Login.js"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Пароль"
            placeholder="Введите пароль"
            required
            autoComplete="current-password"
            dataEasytag="id9-react/src/pages/Login.js"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            dataEasytag="id10-react/src/pages/Login.js"
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="auth-footer" data-easytag="id11-react/src/pages/Login.js">
          <p data-easytag="id12-react/src/pages/Login.js">
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link" data-easytag="id13-react/src/pages/Login.js">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;