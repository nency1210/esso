import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCSAQMxWshDonpU6L53aQEf_ikbvRbdcCo",
  authDomain: "esso-d6a3c.firebaseapp.com",
  projectId: "esso-d6a3c",
  storageBucket: "esso-d6a3c.appspot.com",
  messagingSenderId: "794205851423",
  appId: "1:794205851423:web:cd11eceb4921a130ccaa2a",
  measurementId: "G-3HN298HG56"
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Obtain an instance of Firebase Analytics if necessary
const analytics = getAnalytics(app);

export { app }; // Export the initialized app
