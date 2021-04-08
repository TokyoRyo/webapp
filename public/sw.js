var cacheName = 'ver3.0.0';
var staticFiles = [
    '/',
    '/tokyoryo-webapp-bundle.css?' + cacheName,
    '/tokyoryo-webapp-bundle.js?' + cacheName,
    '/icons'
];

self.addEventListener('install', (e) => {
});

self.addEventListener('fetch', function(e) {
});
