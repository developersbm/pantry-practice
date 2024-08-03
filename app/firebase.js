import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu_Zcc10DEJV1n57FOQJgfSLRZPLJJYq4",
  authDomain: "pantry-practice.firebaseapp.com",
  projectId: "pantry-practice",
  storageBucket: "pantry-practice.appspot.com",
  messagingSenderId: "862242709340",
  appId: "1:862242709340:web:5cc11e3979fe8103422b99",
  measurementId: "G-X97QNJEZLY"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
