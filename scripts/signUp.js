// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Sign-Up with Email and Password
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Set display name
            updateProfile(user, { displayName: username })
                .then(() => {
                    console.log("User created:", user);
                    window.location.href = "chat-list.html"; // Redirect to chat page
                })
                .catch((error) => {
                    console.error("Profile Update Error:", error.message);
                });
        })
        .catch((error) => {
            console.error("Sign-Up Error:", error.message);
            errorMessage.textContent = error.message;
        });
});

// Sign-Up with Google
document.getElementById("google-signup").addEventListener("click", function () {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            console.log("Google Sign-Up successful:", result.user);
            window.location.href = "chat-list.html"; // Redirect to chat page
        })
        .catch((error) => {
            console.error("Google Sign-Up Error:", error.message);
        });
});
