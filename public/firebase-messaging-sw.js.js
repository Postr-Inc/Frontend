// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyA-oSN1PMfaUbRhM40t8sNcsk-RZ5ORKrU",
    authDomain: "postr-49456.firebaseapp.com",
    projectId: "postr-49456",
    storageBucket: "postr-49456.appspot.com",
    messagingSenderId: "43438096605",
    appId: "1:43438096605:web:5ae92db6f61126b7e7db34"
  };
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});