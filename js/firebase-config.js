// Firebase Configuration — FALCONZ BOY
// Project: falconzshots | https://console.firebase.google.com/project/falconzshots
const firebaseConfig = {
  apiKey: "AIzaSyBejR-Gl0KDzUR4nEiOQzylFJ7h3yICQhA",
  authDomain: "falconzshots.firebaseapp.com",
  projectId: "falconzshots",
  storageBucket: "falconzshots.firebasestorage.app",
  messagingSenderId: "1082693794426",
  appId: "1:1082693794426:web:935c8d248dd317c6c319c3"
};

// Initialize Firestore Native
let firebaseDb = null;
try {
  if (typeof firebase !== 'undefined') {
    const app = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.firestore();
    window.firebaseDb = firebaseDb;
    console.log("🔥 Firestore connected — Project: falconzshots");
  }
} catch (err) {
  console.warn("Firestore initialization notice:", err);
}
