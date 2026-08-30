import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Firebase ของเรา
const firebaseConfig = {
    apiKey: "AIzaSyAifqA1kG88QB0TMpZl7qyBW_Cd7hJ31Gk",
    authDomain: "hear-me-out-dfdba.firebaseapp.com",
    projectId: "hear-me-out-dfdba",
    storageBucket: "hear-me-out-dfdba.firebasestorage.app",
    messagingSenderId: "30523548270",
    appId: "1:30523548270:web:2450a877d6cbfe83b37c7f"
};


// เริ่ม Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// HTML
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const messagesDiv = document.getElementById("messages");


// ส่งข้อความ
sendButton.addEventListener("click", async () => {

    const message = messageInput.value.trim();

    if (message === "") {
        alert("กรุณาพิมพ์ข้อความก่อนส่ง");
        return;
    }

    try {

        await addDoc(collection(db, "messages"), {
            message: message,
            time: serverTimestamp()
        });

        messageInput.value = "";

    } catch (error) {

        console.error(error);
        alert("ส่งข้อความไม่สำเร็จ");

    }

});


// กด Enter เพื่อส่ง
messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendButton.click();

    }

});


// โหลดข้อความแบบ Real-time
const messagesQuery = query(
    collection(db, "messages"),
    orderBy("time", "asc")
);


onSnapshot(messagesQuery, (snapshot) => {

    messagesDiv.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const box = document.createElement("div");
        box.className = "message";

        const text = document.createElement("div");
        text.className = "message-text";
        text.textContent = data.message;

        const time = document.createElement("div");
        time.className = "message-time";

        if (data.time) {

            const date = data.time.toDate();

            time.textContent = date.toLocaleString("th-TH");

        }

        box.appendChild(text);
        box.appendChild(time);

        messagesDiv.appendChild(box);

    });

    // เลื่อนไปข้อความล่าสุด
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

});