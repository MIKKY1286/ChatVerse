// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, doc, getDoc, serverTimestamp, updateDoc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get the receiver's username from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const receiver = urlParams.get("user");

if (!receiver) {
    alert("Invalid chat session.");
    window.location.href = "index.html"; // Redirect if no user is selected
}

// DOM Elements
const chatHeader = document.getElementById("chat-header");
const chatContainer = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const logoutButton = document.getElementById("logout-button");

let senderEmail = null;

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = "login.html";
        return;
    }

    senderEmail = user.email;
    await loadReceiverProfile();
    loadMessages();
    updateUserStatus(true);
});

// Function to load receiver's profile
async function loadReceiverProfile() {
    try {
        const userDoc = await getDoc(doc(db, "users", receiver));
        if (userDoc.exists()) {
            chatHeader.textContent = userDoc.data().name || receiver;
        } else {
            chatHeader.textContent = receiver; // Fallback to email
        }
    } catch (error) {
        console.error("Error fetching receiver profile:", error);
    }
}

// Function to load messages in real-time
function loadMessages() {
    const chatQuery = query(
        collection(db, "messages"),
        where("participants", "array-contains", senderEmail),
        orderBy("timestamp", "asc")
    );

    onSnapshot(chatQuery, (snapshot) => {
        chatContainer.innerHTML = ""; // Clear previous messages

        snapshot.docs.forEach(doc => {
            const { sender, message, timestamp } = doc.data();

            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", sender === senderEmail ? "sent" : "received");

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
    if (!message) return;

    try {
        await addDoc(collection(db, "messages"), {
            sender: senderEmail,
            receiver,
            participants: [senderEmail, receiver],
            message,
            timestamp: serverTimestamp()
        });

        messageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Update user online status
async function updateUserStatus(isOnline) {
    if (!senderEmail) return;

    try {
        const userRef = doc(db, "users", senderEmail);
        await updateDoc(userRef, { online: isOnline });
    } catch (error) {
        console.error("Error updating user status:", error);
    }
}

// Event Listeners
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Logout function
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "./login.html";
    }).catch(error => {
        console.error("Error logging out:", error);
    });
});

// Handle when the user closes the window
window.addEventListener("beforeunload", () => {
    updateUserStatus(false);
});
