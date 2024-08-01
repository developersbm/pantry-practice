import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore}