const express = require('express');
const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const { SitemapStream, streamToPromise } = await import('sitemap');

    res.header('Content-Type', 'application/xml');

    const sitemapStream = new SitemapStream({
      hostname: 'https://student-hostels.netlify.app',
    });

    streamToPromise(sitemapStream).then((sm) => res.send(sm));

    // Static pages
    sitemapStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    sitemapStream.write({ url: '/homepage.html', changefreq: 'daily', priority: 0.9 });
    sitemapStream.write({ url: '/dashboard.html', changefreq: 'weekly', priority: 0.7 });
    sitemapStream.write({ url: '/login.html', changefreq: 'monthly', priority: 0.3 });
    sitemapStream.write({ url: '/signup.html', changefreq: 'monthly', priority: 0.3 });
    sitemapStream.write({ url: '/forgot-password.html', changefreq: 'monthly', priority: 0.1 });

    sitemapStream.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
});

module.exports = router;