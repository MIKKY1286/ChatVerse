// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Get receiver's username from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const receiver = urlParams.get("user");
const sender = localStorage.getItem("username") || "Guest"; // Replace with actual auth user

// DOM Elements
const chatContainer = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Update chat header
document.addEventListener("DOMContentLoaded", () => {
    const chatHeader = document.getElementById("chat-header");
    chatHeader.textContent = receiver || "Chat";
});

// Function to load messages in real-time
function loadMessages() {
    if (!receiver) {
        console.error("Receiver username is missing in the URL.");
        return;
    }

    const chatRef = collection(db, "messages");
    const chatQuery = query(
        chatRef,
        where("participants", "array-contains", sender), // Fetch only relevant chats
        orderBy("timestamp", "asc")
    );

    onSnapshot(chatQuery, (snapshot) => {
        chatContainer.innerHTML = ""; // Clear previous messages

        snapshot.docs.forEach(doc => {
            const { sender: msgSender, message, timestamp } = doc.data();

            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", msgSender === sender ? "sent" : "received");

            msgDiv.innerHTML = `
                <p>${message}</p>
                <span class="time">${timestamp?.toDate().toLocaleTimeString() || "Just now"}</span>
            `;

            chatContainer.appendChild(msgDiv);
        });

        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to latest message
    });
}

// Function to send a message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) {
        alert("Message cannot be empty!");
        return;
    }

    if (!receiver) {
        alert("No receiver found!");
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            sender,
            receiver,
            participants: [sender, receiver],
            message,
            timestamp: serverTimestamp()
        });

        messageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message!");
    }
}

// Ensure event listeners are added correctly
document.addEventListener("DOMContentLoaded", () => {
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    loadMessages(); // Load messages when the page loads
});
