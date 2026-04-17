import { initializeApp } from "firebase/app";
// 1. Change initializeAuth to getAuth
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqgqVRlErhSYQH-Y2_hHiwSTT-03oH9mU",
  authDomain: "cop-logistics-app.firebaseapp.com",
  projectId: "cop-logistics-app",
  storageBucket: "cop-logistics-app.firebasestorage.app",
  messagingSenderId: "138396324363",
  appId: "1:138396324363:web:455360bb6d3e65d8d52d0e",
  measurementId: "G-SNJFLPT3WP"
};

// 2. Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// 3. Export Auth using getAuth for better compatibility with Expo Go
export const auth = getAuth(app);