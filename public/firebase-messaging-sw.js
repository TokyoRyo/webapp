importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDigKfD53FVscLs1v8n2PnSGeXg4woATC4",
    authDomain: "tokyo-ryo.firebaseapp.com",
    databaseURL: "https://tokyo-ryo-default-rtdb.firebaseio.com",
    projectId: "tokyo-ryo",
    storageBucket: "tokyo-ryo.appspot.com",
    messagingSenderId: "758304906265",
    appId: "1:758304906265:web:4298c93dbbde17f5ce1e88"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.content,
      icon: '/icons/icon-152x152.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
});
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow('https://tokyo-ryo.web.app/'));
});
