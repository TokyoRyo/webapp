importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-messaging.js');

firebase.initializeApp({
   apiKey: "AIzaSyAFwYCHTlYgN_feZFKsFnR5U6hWCnfbvaY",
   authDomain: "tokyoryo-20a72.firebaseapp.com",
   databaseURL: "https://tokyoryo-20a72.firebaseio.com",
   projectId: "tokyoryo-20a72",
   storageBucket: "tokyoryo-20a72.appspot.com",
   messagingSenderId: "202064602931",
   appId: "1:202064602931:web:6bf7dad51b1d6fccbcc046",
   measurementId: "G-4HGXFJK0TL"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
const notificationTitle = payload.notification.title;
const notificationOptions = {
   body: payload.notification.body,
   icon: payload.notification.icon
   };

   return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', function(event) {
   console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
   console.log('Service Worker activating.');  
});