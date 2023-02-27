import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB9vVndse6NxBTF0LF-MLXf6djdhd7VZVc",
  authDomain: "bringfast-4f44a.firebaseapp.com",
  projectId: "bringfast-4f44a",
  storageBucket: "bringfast-4f44a.appspot.com",
  messagingSenderId: "275832571459",
  appId: "1:275832571459:web:64c76823cc2631e9aab6f6",
  measurementId: "G-PWZ6ECKRBV",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

export default { app, firestore };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
