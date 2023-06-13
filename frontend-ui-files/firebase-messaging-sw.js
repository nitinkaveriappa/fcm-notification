if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "<API-KEY>",
    authDomain: "<PROJECT-ID>.firebaseapp.com",
    projectId: "<PROJECT-ID>",
    storageBucket: "<PROJECT-ID>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
    appId: "<APP_ID>",
    measurementId: "<MEASUREMENT_ID>",
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const initMessaging = firebase.messaging();

initMessaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);
  // Customize notification here
  const notificationTitle = payload?.data?.title
    ? payload?.data?.title
    : "DefaultTitle";
  const notificationOptions = {
    body: payload?.data?.body ? payload.data?.body : "DefaultBody",
    icon: payload?.data?.icon ? payload?.data?.icon : "DefaultURL",
  };

  console.log({
    self,
    registration: self.registration,
    notificationOptions: notificationOptions,
  });

  // use this only to customize the notification and remove notification key from the payload
  self.registration.showNotification(notificationTitle, notificationOptions);

  // Listener for Notification Click
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then((clientList) => {
          console.log(clientList);
          for (const client of clientList) {
            if (client.url === payload?.data?.url && "focus" in client) {
              console.log(client);
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(payload?.data?.url);
          }
        })
    );
  });
});
