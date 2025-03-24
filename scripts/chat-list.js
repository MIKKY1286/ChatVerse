// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getFirestore, collection, query, where, getDocs, addDoc, orderBy 
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

// DOM Elements
const chatList = document.getElementById("chat-list");
const searchBar = document.getElementById("search-bar");
const startChatBtn = document.getElementById("startNewChatBTN");

// Load and display chat list
async function loadChats() {
    chatList.innerHTML = ""; // Clear previous content

    try {
        const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(chatQuery);
        
        if (querySnapshot.empty) {
            chatList.innerHTML = "<p>No chats found</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const { username, lastMessage, timestamp, profilePic, active } = doc.data();

            const chatItem = document.createElement("li");
            chatItem.classList.add("chat-item");
            chatItem.innerHTML = `
                <img src="${profilePic || 'default.jpg'}" alt="${username}">
                <div class="chat-info">
                    <h3>${username} ${active ? '<span class="active-dot"></span>' : ''}</h3>
                    <p>${lastMessage || 'No messages yet'}</p>
                </div>
                <span class="time">${timestamp || ''}</span>
            `;
            chatItem.onclick = () => openChat(username);
            chatList.appendChild(chatItem);
        });
    } catch (error) {
        console.error("Error loading chats:", error);
        chatList.innerHTML = "<p>Error loading chats. Please try again.</p>";
    }
}

// Open a chat
function openChat(username) {
    window.location.href = `chat.html?user=${username}`;
}

// Start a new chat
async function startNewChat() {
    const { value: username } = await Swal.fire({
        title: "Start a New Chat",
        input: "text",
        inputPlaceholder: "Enter username...",
        showCancelButton: true,
        confirmButtonText: "Start Chat",
        confirmButtonColor: "#6a0dad",
        preConfirm: (input) => {
            if (!input) {
                Swal.showValidationMessage("Please enter a username.");
            }
            return input;
        }
    });

    if (!username) return;

    try {
        const chatsRef = collection(db, "chats");
        const chatExists = await getDocs(query(chatsRef, where("username", "==", username)));

        if (!chatExists.empty) {
            Swal.fire("Info", "Chat already exists!", "info");
            openChat(username);
            return;
        }

        await addDoc(chatsRef, {
            username,
            lastMessage: "",
            timestamp: new Date().toLocaleTimeString(),
            profilePic: "default.jpg",
            active: true
        });

        Swal.fire("Success", "New chat started!", "success");
        loadChats(); // Refresh chat list
        openChat(username); // Open the chat immediately
    } catch (error) {
        console.error("Error starting chat:", error);
        Swal.fire("Error", "Failed to start a chat. Please try again.", "error");
    }
}

// Search chats
function searchChats() {
    const input = searchBar.value.toLowerCase();
    document.querySelectorAll(".chat-item").forEach(chat => {
        const name = chat.querySelector("h3").textContent.toLowerCase();
        chat.style.display = name.includes(input) ? "flex" : "none";
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    startChatBtn.addEventListener("click", startNewChat);
    searchBar.addEventListener("input", searchChats);
    loadChats(); // Load chats on page load
});
