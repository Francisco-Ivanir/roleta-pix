import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEV4hUippBi1X3_3UnfqYK0NqYTq0IYRU",
  authDomain: "roleta-pix-e311d.firebaseapp.com",
  projectId: "roleta-pix-e311d",
  storageBucket: "roleta-pix-e311d.firebasestorage.app",
  messagingSenderId: "81962366134",
  appId: "1:81962366134:web:1bb4e81312485d274c6217"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
