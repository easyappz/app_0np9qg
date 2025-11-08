export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const cleaned = phone.replace(/[\s-]/g, '');
  const re = /^[\d+()]+$/;
  if (!re.test(cleaned)) return false;
  const digitsOnly = cleaned.replace(/[^\d]/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error[0];
  if (typeof error === 'object' && error !== null) {
    const firstKey = Object.keys(error)[0];
    return getErrorMessage(error[firstKey]);
  }
  return 'Произошла ошибка';
};