// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5IClEzzrRa8oIFetKV50vN-jGz-YSPhA",
    authDomain: "investimento-app.firebaseapp.com",
    projectId: "investimento-app",
    storageBucket: "investimento-app.firebasestorage.app",
    messagingSenderId: "877753451753",
    appId: "1:877753451753:web:e3889f08896f3ab1c21c78"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
