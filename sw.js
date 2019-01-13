self.importScripts("js/idb.js");

const objectStore = "objectStore";

const restaurantDB = idb.open("restaurant-store", 1, upgradeDB => {
    upgradeDB.createObjectStore(objectStore);
});

const favoriteDb = idb.open("favorite-store", 1, upgradeDB => {
    upgradeDB.createObjectStore(objectStore);
});

const reviewDB = idb.open("review-store", 1, upgradeDB => {
    upgradeDB.createObjectStore(objectStore);
});

const staticCache = "restaurant-static";
const staticAssets = [
    "/",
    "/index.html",
    "/restaurant.html",
    "/js/main.js",
    "/js/dbhelper.js",
    "/js/restaurant_info.js",
    "/css/styles.css",
    "/img/1.jpg", "/img/1.webp",
    "/img/2.jpg", "/img/2.webp",
    "/img/3.jpg", "/img/3.webp",
    "/img/4.jpg", "/img/4.webp",
    "/img/5.jpg", "/img/5.webp",
    "/img/6.jpg", "/img/6.webp",
    "/img/7.jpg", "/img/7.webp",
    "/img/8.jpg", "/img/8.webp",
    "/img/9.jpg", "/img/9.webp",
    "/img/10.jpg", "/img/10.jpg",
    "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
    "https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2",
];

// Call install event
self.addEventListener("install", event => {
    //console.log("Service Worker installed");
    event.waitUntil(
        caches.open(staticCache)
        .then(cache => cache.addAll(staticAssets))
        .catch(error => console.error("Something happened", error))
    );
});

//Call activate event
self.addEventListener("activate", event => {
    //console.log('Service Worker activated');
    event.waitUntil(
        caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames.filter(cacheName => cacheName.startsWith("restaurant-") &&
                !staticCache.includes(cacheName))
            .map(cacheName => caches.delete(cacheName))
        ))
        .catch(error => console.error("Something happened", error))
    );
});

/**
 * Message event
 */
self.addEventListener("message", event => {
    if (event.data.type === "favorite") {
        return favoriteDb.then(db =>
            db.transaction(objectStore, "readwrite").objectStore(objectStore).put(event.data.payload, "favorite") // eslint-disable-line promise/no-nesting
            .then(result => console.info("Favorite Operation succeed", result))
            .catch(error => console.error("Favorite operation failed", error)));
    }
    if (event.data.type === "review") {
        return reviewDB.then(db =>
            db.transaction(objectStore, "readwrite").objectStore(objectStore).put(event.data.payload, "review") // eslint-disable-line promise/no-nesting
            .then(result => console.info("Review Operation succeed", result))
            .catch(error => console.error("Review operation failed", error)));
    }
});

self.addEventListener("sync", event => {
    const url = "https://mws-restaurants-stage-3.herokuapp.com";
    if (event.tag === "Synchronize") {
        reviewDB.then(db => db.transaction(objectStore).objectStore(objectStore).getAll() // eslint-disable-line promise/no-nesting
                .then(reviews => reviews.map(review => fetch(`${url}/reviews/`, {
                    body: review,
                    method: "POST"
                }))))
            .catch(error => console.error("something failed", error));
        favoriteDb.then(db => db.transaction(objectStore).objectStore(objectStore).getAll() // eslint-disable-line promise/no-nesting
                .then(favorites => favorites.map(favorite => fetch(`${url}/restaurants/${favorite.id}/?is_favorite=${favorite.is_favorite}`))))
            .catch(error => console.error("something failed", error));
    }
});

/**
 * Fetch from network event
 */
self.addEventListener("fetch", event => {
    const port = event.request.url.split("/")[2].split(":")[1];

    if (event.request.method === "GET" &&
        (event.request.url.search("localhost") === -1) || // calling for heroku and google maps api
        (port !== undefined && port === "1337") // calling for local backend running on port 1337
    ) {
        event.respondWith(serveResponseIdb(event.request));
    } else {
        event.respondWith(serveResource(event.request));
    }
});

/**
 * Serve response from indexedDB
 * @param {Request} request
 * @return {Promise<Response | void>}
 */
const serveResponseIdb = request => {
    restaurantDB
        .then(db => {
            const response = new Response(db.transaction(objectStore).objectStore(objectStore).get(request.url));
            return Promise.resolve(response); // eslint-disable-line promise/no-return-wrap
        })
        .catch(error => console.error("Unable to access cache: ", error));

    return fetch(request)
        .then(fetchResponse => {
            if (fetchResponse.headers.get("Content-Type").match(/application\/json/i)) {
                restaurantDB.then(db => { // eslint-disable-line promise/always-return, promise/no-nesting
                        fetchResponse.clone().json().then(content => { // eslint-disable-line promise/catch-or-return, promise/no-nesting
                            const tx = db.transaction(objectStore, "readwrite");
                            tx.objectStore(objectStore) // eslint-disable-line promise/no-nesting
                                .put(content, request.url)
                                .then(response => console.info("put operation succeed: ", response))
                                .catch(error => console.error("Put operation failed: ", error));
                            return tx.complete;
                        });
                    })
                    .catch(error => console.error("Error opening transaction: ", error));
            }

            return fetchResponse;
        })
        .catch(error => console.error("Fetch Error: ", error));
};

/**
 * Serve resource from cache or network
 * @param {Request} request client request
 * @return {Promise<Response | void>}
 */
const serveResource = request =>
    caches.open(staticCache)
    .then(cache =>
        cache.match(request) // eslint-disable-line promise/no-nesting
        .then(response => {
            if (response) {
                return response;
            }

            return fetch(request) // eslint-disable-line promise/no-nesting
                .then(networkResponse => {
                    cache.put(request, networkResponse.clone()) // eslint-disable-line promise/no-nesting
                        .then(() => console.info("Caching succeed"))
                        .catch(error => console.error("Caching failed", error));
                    return networkResponse;
                });
        }))
    .catch(error => console.error("Something happened", error));