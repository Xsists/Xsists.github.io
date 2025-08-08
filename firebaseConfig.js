const firebaseConfig = {
  apiKey: "AIzaSyD3uVb6-PnFFHwexRtXr7utuU125XOFq10",
  authDomain: "snakes-game-bcd81.firebaseapp.com",
  databaseURL: "https://snakes-game-bcd81-default-rtdb.firebaseio.com",
  projectId: "snakes-game-bcd81",
  storageBucket: "snakes-game-bcd81.firebasestorage.app",
  messagingSenderId: "159408321147",
  appId: "1:159408321147:web:a316e7eec850afe3e228de",
  measurementId: "G-HC4TV0G43P"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();