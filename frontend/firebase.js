// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "forksy-food-delivery.firebaseapp.com",
  projectId: "forksy-food-delivery",
  storageBucket: "forksy-food-delivery.firebasestorage.app",
  messagingSenderId: "889192731694",
  appId: "1:889192731694:web:fdcf8bc4b3aa95d68a3bbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export {app, auth}