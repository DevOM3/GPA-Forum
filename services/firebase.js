import firebase from "firebase";
import "firebase/storage";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCbXuQGnp8W37kGybJWy6EFsgD1XPXebnU",
  authDomain: "gpa-forum.firebaseapp.com",
  projectId: "gpa-forum",
  storageBucket: "gpa-forum.appspot.com",
  messagingSenderId: "368470714348",
  appId: "1:368470714348:web:31ba55bf75eecc3686c2c9",
  measurementId: "G-9W71TWZ1L0",
};

if (!firebase.apps.length) {
  var firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore(firebaseApp);
const storage = firebase.app().storage();
const auth = firebase.auth();

export { db, storage, auth, firebase };
