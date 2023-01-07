// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup, sendPasswordResetEmail, signOut, } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh_PpK9fcONIs9WpG0UIaXqJtUDANktn0",
  authDomain: "medico-855ad.firebaseapp.com",
  projectId: "medico-855ad",
  storageBucket: "medico-855ad.appspot.com",
  messagingSenderId: "692638654634",
  appId: "1:692638654634:web:fa1c710af050923906b0d3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


// sign with Google
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    alert('sign up with succes');
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};


// Logout
const logout = () => {
  signOut(auth);
};

export { auth, db, signInWithGoogle, logout };