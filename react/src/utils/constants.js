// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    LOGOUT: '/api/auth/logout/',
    ME: '/api/auth/me/',
    REFRESH: '/api/auth/token/refresh/',
  },
  LISTINGS: {
    LIST: '/api/listings/',
    DETAIL: (id) => `/api/listings/${id}/`,
    MY_LISTINGS: '/api/listings/my/',
    CREATE: '/api/listings/',
    UPDATE: (id) => `/api/listings/${id}/`,
    DELETE: (id) => `/api/listings/${id}/`,
    UPLOAD_IMAGE: (id) => `/api/listings/${id}/upload-image/`,
  },
  CATEGORIES: {
    LIST: '/api/categories/',
  },
  USERS: {
    PROFILE: '/api/users/profile/',
    UPDATE_PROFILE: '/api/users/profile/',
    UPDATE_AVATAR: '/api/users/profile/avatar/',
  },
  ADMIN: {
    STATS: '/api/admin/stats/',
    MODERATION: '/api/admin/moderation/',
    APPROVE: (id) => `/api/admin/moderation/${id}/approve/`,
    REJECT: (id) => `/api/admin/moderation/${id}/reject/`,
  },
};

// Listing status values
export const LISTING_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Listing status labels (Russian)
export const LISTING_STATUS_LABELS = {
  [LISTING_STATUS.DRAFT]: 'Черновик',
  [LISTING_STATUS.PENDING]: 'На модерации',
  [LISTING_STATUS.APPROVED]: 'Опубликовано',
  [LISTING_STATUS.REJECTED]: 'Отклонено',
};

// Error messages in Russian
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещён.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
  LOGIN_FAILED: 'Неверное имя пользователя или пароль.',
  REGISTRATION_FAILED: 'Ошибка регистрации. Попробуйте снова.',
  UPLOAD_FAILED: 'Ошибка загрузки файла.',
  DELETE_FAILED: 'Ошибка удаления.',
  UPDATE_FAILED: 'Ошибка обновления.',
  CREATE_FAILED: 'Ошибка создания.',
};

// Success messages in Russian
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Вы успешно вошли в систему.',
  LOGOUT_SUCCESS: 'Вы вышли из системы.',
  REGISTRATION_SUCCESS: 'Регистрация прошла успешно.',
  PROFILE_UPDATED: 'Профиль успешно обновлён.',
  LISTING_CREATED: 'Объявление создано и отправлено на модерацию.',
  LISTING_UPDATED: 'Объявление успешно обновлено.',
  LISTING_DELETED: 'Объявление удалено.',
  IMAGE_UPLOADED: 'Изображение загружено.',
  IMAGE_DELETED: 'Изображение удалено.',
  APPROVED: 'Объявление одобрено.',
  REJECTED: 'Объявление отклонено.',
};

// Validation rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 150,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    ERROR_MESSAGES: {
      REQUIRED: 'Имя пользователя обязательно.',
      MIN_LENGTH: 'Минимум 3 символа.',
      MAX_LENGTH: 'Максимум 150 символов.',
      PATTERN: 'Только буквы, цифры и подчёркивание.',
    },
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    ERROR_MESSAGES: {
      REQUIRED: 'Пароль обязателен.',
      MIN_LENGTH: 'Минимум 8 символов.',
      MAX_LENGTH: 'Максимум 128 символов.',
      MISMATCH: 'Пароли не совпадают.',
    },
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ERROR_MESSAGES: {
      REQUIRED: 'Email обязателен.',
      INVALID: 'Неверный формат email.',
    },
  },
  PHONE: {
    PATTERN: /^\+?[0-9]{10,15}$/,
    ERROR_MESSAGES: {
      REQUIRED: 'Телефон обязателен.',
      INVALID: 'Неверный формат телефона.',
    },
  },
  LISTING: {
    TITLE: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 200,
      ERROR_MESSAGES: {
        REQUIRED: 'Название обязательно.',
        MIN_LENGTH: 'Минимум 5 символов.',
        MAX_LENGTH: 'Максимум 200 символов.',
      },
    },
    DESCRIPTION: {
      MIN_LENGTH: 20,
      MAX_LENGTH: 5000,
      ERROR_MESSAGES: {
        REQUIRED: 'Описание обязательно.',
        MIN_LENGTH: 'Минимум 20 символов.',
        MAX_LENGTH: 'Максимум 5000 символов.',
      },
    },
    PRICE: {
      MIN: 0,
      MAX: 999999999,
      ERROR_MESSAGES: {
        REQUIRED: 'Цена обязательна.',
        MIN: 'Цена не может быть отрицательной.',
        MAX: 'Цена слишком велика.',
        INVALID: 'Неверный формат цены.',
      },
    },
    CATEGORY: {
      ERROR_MESSAGES: {
        REQUIRED: 'Категория обязательна.',
      },
    },
    IMAGES: {
      MAX_COUNT: 5,
      MAX_SIZE: 5 * 1024 * 1024, // 5MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
      ERROR_MESSAGES: {
        MAX_COUNT: 'Максимум 5 изображений.',
        MAX_SIZE: 'Размер файла не должен превышать 5 МБ.',
        INVALID_TYPE: 'Допустимые форматы: JPEG, PNG, WEBP.',
      },
    },
  },
};

// Sort options
export const SORT_OPTIONS = [
  { value: '-created_at', label: 'По дате (новые первые)' },
  { value: 'price', label: 'По цене (возрастание)' },
  { value: '-price', label: 'По цене (убывание)' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
};

// Toast notification settings
export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSЕ_ON_HOVER: true,
  DRAGGABLE: true,
};

// Debounce delay for search input (ms)
export const SEARCH_DEBOUNCE_DELAY = 500;

// Image slider settings
export const SLIDER_SETTINGS = {
  AUTO_PLAY: false,
  AUTO_PLAY_INTERVAL: 3000,
  SHOW_THUMBNAILS: true,
  SHOW_ARROWS: true,
  SHOW_DOTS: true,
};

// Date format
export const DATE_FORMAT = 'DD.MM.YYYY';
export const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

// Currency
export const CURRENCY = '₽';

// App info
export const APP_INFO = {
  NAME: 'Доска объявлений',
  DESCRIPTION: 'Платформа для размещения и поиска объявлений',
  VERSION: '1.0.0',
  AUTHOR: 'EasyAppz',
  EMAIL: 'info@listings.ru',
  PHONE: '+7 (XXX) XXX-XX-XX',
};

// Social media links
export const SOCIAL_LINKS = {
  VK: 'https://vk.com',
  TELEGRAM: 'https://t.me',
  OK: 'https://ok.ru',
};

// Responsive breakpoints (matching CSS variables)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};
