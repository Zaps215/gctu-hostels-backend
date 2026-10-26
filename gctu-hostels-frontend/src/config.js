// Automatically detects if you are running locally or live on Netlify/Render
const HOSTNAME = window.location.hostname;
const IS_LOCAL = HOSTNAME === 'localhost' || HOSTNAME === '127.0.0.1';

// Keep the same hostname as the page so session cookies are treated as same-site
const BASE_URL = IS_LOCAL 
    ? `http://${HOSTNAME}:5000` 
    : 'https://gctu-hostels-backend.onrender.com'; // Your live Render URL

const API_CONFIG = {
    AUTH_API: `${BASE_URL}/api`,
    HOSTEL_API: `${BASE_URL}/api/hostels`
};