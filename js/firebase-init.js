const firebaseConfig = {

    apiKey: "AIzaSyA5Wy9vcg9ft0f-ABA9-_gELDuzHCjsCyU",

    authDomain: "assignify-c8ca0.firebaseapp.com",

    projectId: "assignify-c8ca0",

    storageBucket: "assignify-c8ca0.firebasestorage.app",

    messagingSenderId: "579040733871",

    appId: "1:579040733871:web:da36004805c3473296c25a",

    measurementId: "G-LJXWRSQ747"

  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
