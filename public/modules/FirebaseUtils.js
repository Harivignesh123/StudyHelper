
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getDatabase, ref, set, update, push, onValue,onChildAdded} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeFBXxvNWBLjPhqhfuER6r4SrQ0lBMAvk",
  authDomain: "studyhelper-acc4f.firebaseapp.com",
  projectId: "studyhelper-acc4f",
  storageBucket: "studyhelper-acc4f.appspot.com",
  messagingSenderId: "690744064613",
  appId: "1:690744064613:web:15a92b1e39c29a5bc0a48c",
  measurementId: "G-6YL23ZFNL0",
  databaseURL: "https://studyhelper-acc4f-default-rtdb.asia-southeast1.firebasedatabase.app"
};


const app = initializeApp(firebaseConfig);

const db=getDatabase(app);

export{db, ref,set, push, update, onValue, onChildAdded};





