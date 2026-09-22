// Firebase Configuration — FALCONZ BOY
// Project: falconzshots | https://console.firebase.google.com/project/falconzshots
const firebaseConfig = {
  apiKey: "AIzaSyBejR-Gl0KDzUR4nEiOQzylFJ7h3yICQhA",
  authDomain: "falconzshots.firebaseapp.com",
  projectId: "falconzshots",
  storageBucket: "falconzshots.firebasestorage.app",
  messagingSenderId: "1082693794426",
  appId: "1:1082693794426:web:935c8d248dd317c6c319c3",
  measurementId: "G-XYVPZM6PXB"
};

// Initialize Firebase (compat SDK — loaded via CDN in index.html)
let firebaseDb = null;
let firebaseApp = null;
try {
  if (typeof firebase !== 'undefined') {
    // Avoid re-initializing if already done
    firebaseApp = firebase.apps.length
      ? firebase.apps[0]
      : firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.firestore();
    // Expose globally so inline scripts can access them
    window.firebaseDb = firebaseDb;
    window.firebaseAuth = firebase.auth();
    window.firebaseStorage = firebase.storage();
    console.log("🔥 Firebase ready — Firestore, Auth & Storage connected — Project: falconzshots");
  } else {
    console.info("ℹ️ Firebase SDK not loaded yet. Make sure Firebase compat scripts are added to index.html.");
  }
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}
