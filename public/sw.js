const CACHE_NAME = 'pavani-video-cache-v1';
const VIDEO_URLS = [
  '/videos/amethyst.mp4',
  // You can add Cloudinary URLs here too, but they must support CORS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(VIDEO_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle video files
  if (url.pathname.endsWith('.mp4') || event.request.destination === 'video') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached version if found, otherwise fetch and cache
        if (response) {
          return response;
        }

        return fetch(event.request).then((fetchResponse) => {
          // Check if we received a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        });
      })
    );
  }
});
