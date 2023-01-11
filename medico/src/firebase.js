// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup, sendPasswordResetEmail, signOut, } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { onSnapshot } from "firebase/firestore"; 
import { enableIndexedDbPersistence } from "firebase/firestore"; 
import { disableNetwork } from "firebase/firestore"; 
import { enableNetwork } from "firebase/firestore"; 


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
const feedback = [];
const medicaments = [];
const poids = null;
const taille = null;
const age = null;
const sexe = null;

const description = null;
const localisation = null;

// sign with Google
const signInWithGoogle = async (param) => {
  if (param === 'user') {
    try {
      const resp = await signInWithPopup(auth, googleProvider);
      const userp = resp.user;
      const qp = query(collection(db, "pharmacies"), where("uid", "==", userp.uid));
      const docsp = await getDocs(qp);

      if (docsp.docs.length != 0) {
        alert('Vous etes inscrit en tant que pharmacie !!!');
        return false;
      } else {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0 && docsp.docs.length === 0) {
          await setDoc(doc(collection(db, "users"), user.displayName), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
            feedback: feedback,
            medicaments: medicaments,
            creationTime: user.metadata.creationTime,
            lastSeenTime: user.metadata.lastSignInTime,
            userPhoto: user.photoURL,
            poids: poids,
            taille: taille,
            age: age,
            sexe: sexe,
          });
        }
        console.log("sign sucess");
      }
    } catch (err) {
      console.error(err);
    }
  } else if (param === 'pharmacie') {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);

      if (docs.docs.length != 0) {
        alert('Vous etes inscrit en tant que client !!!');
        return false;
      } else {
        const resp = await signInWithPopup(auth, googleProvider);
        const userp = resp.user;
        const qp = query(collection(db, "pharmacies"), where("uid", "==", userp.uid));
        const docsp = await getDocs(qp);
        if (docsp.docs.length === 0) {
          await setDoc(doc(collection(db, "pharmacies"), userp.displayName), {
            uid: userp.uid,
            name: userp.displayName,
            authProvider: "google",
            email: userp.email,
            feedback: feedback,
            description: description,
            localisation: localisation,
            medicaments: medicaments,
            creationTime: userp.metadata.creationTime,
            lastSeenTime: userp.metadata.lastSignInTime,
            pharmaciePhoto: userp.photoURL,       
          });
        }
        console.log("sign sucess");
      }
    } catch (err) {
      console.error(err);
    }
  }
  
};


// Firebase storage reference
const storage = getStorage(app);
export default storage;

// Local Storage
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
// Subsequent queries will use persistence, if it was enabled successfully
const q = query(collection(db, "users"), where("uid", "==", "userid"));
onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        console.log("change");

        const source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Data came from " + source);
    });
});


// disable user connexion to firebase
const stopNetworkAcces = async () => {
		await disableNetwork(db);
		console.log("Network disabled!");
}

// enable user connexion to firebase
const activeNetworkAcces = async () => {
    await enableNetwork(db);  
    console.log("Network enable");
    // Do online actions
    // ...
}

// Logout
const logout = () => {
  signOut(auth);
};

export { auth, db, signInWithGoogle, logout };