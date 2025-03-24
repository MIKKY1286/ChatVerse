// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.firebasestorage.app",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:1fa9900478503abe4b531a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized...");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Splash screen loaded...");

   
    setTimeout(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in. Redirecting to chat list...");
                window.location.href = "./pages/chat-list.html"; 
            } else {
                console.log("User not logged in. Redirecting to login...");
                window.location.href = "./pages/login.html"; 
            }
        });
    }, 4000);
});
