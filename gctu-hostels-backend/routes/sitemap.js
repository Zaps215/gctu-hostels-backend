const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

router.get('/sitemap.xml', async (req, res) => {
  try {
    // 1. List all your actual frontend HTML pages
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },               // Root / index
      { url: '/index.html', changefreq: 'daily', priority: 1.0 },       // Index page
      { url: '/homepage.html', changefreq: 'daily', priority: 0.9 },    // Main landing/homepage
      { url: '/dashboard.html', changefreq: 'weekly', priority: 0.6 },  // User dashboard
      { url: '/login.html', changefreq: 'monthly', priority: 0.5 },     // Login page
      { url: '/signup.html', changefreq: 'monthly', priority: 0.5 },    // Signup page
      { url: '/forgot-password.html', changefreq: 'yearly', priority: 0.3 }, // Password recovery
    ];

    // 2. Create the sitemap stream pointing to your live Netlify domain
    const stream = new SitemapStream({ hostname: 'https://student-hostels.netlify.app' });
    
    res.header('Content-Type', 'application/xml');

    // 3. Convert stream to a promise and send the XML response
    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
    
    return res.send(xml);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
});

module.exports = router;