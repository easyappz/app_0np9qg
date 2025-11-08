// Routes configuration
export const routes = [
  '/',
  '/listing/:id',
  '/login',
  '/register',
  '/profile',
  '/my-listings',
  '/create-listing',
  '/edit-listing/:id',
  '/admin',
  '/admin/moderation',
];

// Notify parent about available routes
export const notifyRoutes = () => {
  if (window.handleRoutes) {
    const routePaths = routes.map(route => route.replace(/:\w+/g, '1'));
    window.handleRoutes(routePaths);
  }
};