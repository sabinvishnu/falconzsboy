// Firebase Configuration for Global Visitor Shots Sync
// Replace the values below with your Firebase Project configuration from https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let firebaseDb = null;
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.firestore();
    console.log("⚡ Firebase Firestore successfully connected for Visitor Shots!");
  } else {
    console.info("ℹ️ Firebase config is in placeholder mode. Update js/firebase-config.js with your Firebase Project credentials to enable global real-time synchronization.");
  }
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}
