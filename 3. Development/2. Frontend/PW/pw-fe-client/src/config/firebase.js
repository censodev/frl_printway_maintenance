import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAJwxGzYGe94XvgpHoDE73xrqwoRNOu4dk",
    authDomain: "fir-notification-fc41a.firebaseapp.com",
    databaseURL: "https://fir-notification-fc41a.firebaseio.com",
    projectId: "fir-notification-fc41a",
    storageBucket: "fir-notification-fc41a.appspot.com",
    messagingSenderId: "755922810081",
    appId: "1:755922810081:web:8392c26de9a9c6ddc733a0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
