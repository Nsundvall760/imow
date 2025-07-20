const config = {
  // Use environment variable for API URL, fallback to production URL, then localhost for development
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://imow.onrender.com',
  
  // You can add other configuration here
  UPLOAD_PATH: '/uploads',
  API_ENDPOINTS: {
    builds: '/api/builds',
    mods: '/api/mods',
    modsLogin: '/api/mods/login'
  }
};

export default config; 