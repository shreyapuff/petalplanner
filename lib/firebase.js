// lib/firebase.js

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaUxtmXmEqnWcz33xIwlUf2hdLyVQo04w",
  authDomain: "petalplanner-d091a.firebaseapp.com",
  projectId: "petalplanner-d091a",
  storageBucket: "petalplanner-d091a.appspot.com",
  messagingSenderId: "916431870948",
  appId: "1:916431870948:web:31a181c6ece70f52dd85f1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore and Auth
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
