import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyA-oSN1PMfaUbRhM40t8sNcsk-RZ5ORKrU",
  authDomain: "postr-49456.firebaseapp.com",
  projectId: "postr-49456",
  storageBucket: "postr-49456.appspot.com",
  messagingSenderId: "43438096605",
  appId: "1:43438096605:web:5ae92db6f61126b7e7db34",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

getToken(messaging, {
  vapidKey:
    "BP_SsEZWlwYzpfW8umXYxCa13DNDpSHGnQRtOgagv5cz06IiDmT171GQUGginY0pd9eZlUUpEoFKLQRnnK1-fw4",
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("current token for client: ", currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log(
        "No registration token available. Request permission to generate one.",
      );
      setTokenFound(false);
      // shows on the UI that permission is required
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // catch error while creating client token
  });
