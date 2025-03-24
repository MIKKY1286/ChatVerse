// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.firebasestorage.app",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:1fa9900478503abe4b531a"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Login with email and password
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Login successful:", userCredential.user);
            window.location.href = "./chat-list.html"; // Redirect to chat page
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            errorMessage.textContent = "Invalid email or password!";
        });
});

// Login with Google
document.getElementById("google-login").addEventListener("click", function () {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            console.log("Google Login successful:", result.user);
            window.location.href = "chat-list.html"; // Redirect to chat page
        })
        .catch((error) => {
            console.error("Google Sign-In Error:", error.message);
        });
});
