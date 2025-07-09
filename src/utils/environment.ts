export const isDevelopment = () => {
  return import.meta.env.VITE_APP_ENV === 'development' || 
         import.meta.env.DEV || 
         import.meta.env.MODE === 'development';
};

export const isProduction = () => {
  return import.meta.env.VITE_APP_ENV === 'production' || 
         import.meta.env.PROD || 
         import.meta.env.MODE === 'production';
};

export const isFraudFeaturesEnabled = () => {
  return import.meta.env.VITE_FRAUD_FEATURES_ENABLED === 'true' || isDevelopment();
};

export const getEnvironmentName = () => {
  return import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development';
}; 