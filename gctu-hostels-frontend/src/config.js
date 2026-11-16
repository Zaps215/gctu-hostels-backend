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

async function fetchAllHostels() {
    const hostels = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const response = await fetch(`${API_CONFIG.HOSTEL_API}?page=${page}&limit=50`, { cache: 'no-store' });
        const result = await response.json();
        const reportedPages = result.pagination?.totalPages;

        if (!response.ok || !result.success || !Array.isArray(result.data) ||
            !Number.isSafeInteger(reportedPages) || reportedPages < 0) {
            throw new Error(result.error || 'Unable to load hostel listings.');
        }

        hostels.push(...result.data);
        totalPages = Math.max(1, reportedPages);
        page += 1;
    }

    return hostels;
}