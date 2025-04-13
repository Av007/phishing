export const getEnvsUrl = (param = 'VITE_MANAGEMENT_URL') => import.meta.env[param] || process.env[param];
