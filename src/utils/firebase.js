

// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Your web app's Firebase configuration (replace with your own credentials)
const firebaseConfig = {
    apiKey: "AIzaSyDjdtMUGT33mbHapkf0k9fIxxEm1a6DVpM",
    authDomain: "safeears-d8152.firebaseapp.com",
    projectId: "safeears-d8152",
    storageBucket: "safeears-d8152.firebasestorage.app",
    messagingSenderId: "697624931239",
    appId: "1:697624931239:web:82df4be02d53a28aa86482",
    measurementId: "G-MX4Y393X6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
