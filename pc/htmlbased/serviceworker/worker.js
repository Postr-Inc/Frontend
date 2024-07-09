self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
});

var session = null;
var token = null;
self.addEventListener('message', function(event) {
     const { type, payload } = event.data;  
     if(type === 'session') {
        session = payload;
     }
     else if(type === 'token') {
        token = payload;
     }
});


