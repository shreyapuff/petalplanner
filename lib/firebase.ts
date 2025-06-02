import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDaUxtmXmEqnWcz33xIwlUf2hdLyVQo04w",
  authDomain: "petalplanner-d091a.firebaseapp.com",
  projectId: "petalplanner-d091a",
  storageBucket: "petalplanner-d091a.appspot.com",
  messagingSenderId: "916431870948",
  appId: "1:916431870948:web:31a181c6ece70f52dd85f1"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
