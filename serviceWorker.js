const staticCache = "restaurant-static-v1";
const staticAssets = [
    '/',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/img/restaurant.ico',
    '/index.html',
    '/restaurant.html',
    '/css/styles-index.css',
    '/css/styles-index.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json'
];

/**
 * Call install event
 */
self.addEventListener("install", event => {
    console.log('Service Worker : Installed');
    event.waitUntil(
        caches.open(staticCache)
        .then(cache => {
            console.log('Service Worker : Caching Files');
            cache.addAll(staticAssets);
        })
        .catch(error => console.error("Service Worker : Install - Something happened", error))
    );
});

/**
 * Call activate event : cleanup the old cache here !!!!
 */
self.addEventListener("activate", event => {
    console.log('Service Worker : Activated');
    //Remove unwanted caches
    event.waitUntil(
        caches.keys()
        .then(cacheNames =>
            Promise.all(
                cacheNames.filter(cacheName => cacheName.startsWith("restaurant") &&
                    !staticCache.includes(cacheName))
                .map(cacheName => {
                    console.log('Service Worker : Activated : Deleted old cache => ' + cacheName);
                    caches.delete(cacheName);
                })
            )
        )
        .catch(error => console.error("Service Worker : Activate - Something happened", error))
    );
});

/**
 * Call fetch event
 */
self.addEventListener("fetch", event => {
    console.log('Service Worker : Fetch');
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
});


// const port = event.request.url.split("/")[2].split(":")[1];

// if (event.request.method === "GET" &&
//     (event.request.url.search("localhost") === -1) || // calling for heroku and google maps api
//     (port !== undefined && port === "1337") // calling for local backend running on port 1337
// ) {
//     event.respondWith(serveResponseIdb(event.request));
// } else {
//     event.respondWith(serveResource(event.request));
// }


const serveResource = request =>
    caches.open(staticCache)
    .then(cache =>
        cache.match(request)
        .then(response => {
            if (response) {
                return response;
            }

            return fetch(request)
                .then(networkResponse => {
                    cache.put(request, networkResponse.clone())
                        .then(() => console.info("Caching succeed"))
                        .catch(error => console.error("Caching failed", error));
                    return networkResponse;
                });
        }))
    .catch(error => console.error("Something happened", error));