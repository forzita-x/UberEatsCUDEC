// Configuración del proyecto ForzaStreetOD
const firebaseConfig = {
  apiKey: "AIzaSyAeaYdjjiIArA3dFOoyTjcHgmm-n5qjemI",
  authDomain: "forzzhub.firebaseapp.com",
  projectId: "forzzhub",
  storageBucket: "forzzhub.firebasestorage.app",
  messagingSenderId: "339733324702",
  appId: "1:339733324702:web:050def54e4a17ef7a02c8f"
};

// Inicializar Firebase usando el objeto global cargado desde el HTML
firebase.initializeApp(firebaseConfig);

// Crear la variable global "db" (Firestore) que necesita db.js
var db = firebase.firestore();
