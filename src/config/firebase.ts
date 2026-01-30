import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Thông tin này lấy từ Firebase Console (Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com", // QUAN TRỌNG: Phải có dòng này để dùng Realtime Database
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database và export nó
export const db = getDatabase(app);