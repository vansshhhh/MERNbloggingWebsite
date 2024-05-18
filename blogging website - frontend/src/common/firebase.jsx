// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRDlu7CAAFNpDiqwwEcGABIBxU6qipx4k",
  authDomain: "mern-blogging-website-b9bb3.firebaseapp.com",
  projectId: "mern-blogging-website-b9bb3",
  storageBucket: "mern-blogging-website-b9bb3.appspot.com",
  messagingSenderId: "803867082004",
  appId: "1:803867082004:web:a3ce0218cbe68f8963d601",
  measurementId: "G-4TZYRVJ86Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async() => {
    
    let user = null;
    await signInWithPopup(auth,provider).then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err);
    })

    return user;
}