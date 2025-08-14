const firebaseConfig = {
  apiKey: "AIzaSyBS24djaddvN3pRnOHEnBbWeCQBtSHOqEo",
  authDomain: "snakes-gmaes.firebaseapp.com",
  databaseURL: "https://snakes-gmaes-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "snakes-gmaes",
  storageBucket: "snakes-gmaes.firebasestorage.app",
  messagingSenderId: "876337267092",
  appId: "1:876337267092:web:5d2290302ce401edaf8f81",
  measurementId: "G-K85B61ZDHS"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();