// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5Wy9vcg9ft0f-ABA9-_gELDuzHCjsCyU",
  authDomain: "assignify-c8ca0.firebaseapp.com",
  projectId: "assignify-c8ca0",
  storageBucket: "assignify-c8ca0.firebasestorage.app",
  messagingSenderId: "579040733871",
  appId: "1:579040733871:web:da36004805c3473296c25a",
  measurementId: "G-LJXWRSQ747"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const hw_input = document.getElementById("hw_input");
const hw_type_select = document.getElementById("hw_type");
const hw_class_select = document.getElementById("hw_class");
const hw_duedate_input = document.getElementById("hw_duedate");
const hw_adder = document.getElementById("hw_adder");
const hw_container = document.getElementById("hw_container");
const delete_all = document.getElementById("delete_all");
const navLinks = document.getElementById("nav-links");

// Authentication DOM Elements
const authContainer = document.getElementById("auth-container");
const appContent = document.getElementById("app-content");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const logoutBtn = document.getElementById("logout-btn");
const userEmailSpan = document.getElementById("user-email");

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    showLoggedInUI(user);
    loadHomework();
  } else {
    // User is signed out
    showLoggedOutUI();
  }
});

// Show/Hide Authentication Elements
function showLoggedInUI(user) {
  authContainer.style.display = "none";
  appContent.style.display = "block";
  userEmailSpan.textContent = user.email;
  
  // Update navigation
  if (!document.getElementById("logout-nav-btn")) {
    const addHomeworkDropdown = document.querySelector(".dropdown");
    if (addHomeworkDropdown && addHomeworkDropdown.parentNode !== navLinks) {
      navLinks.appendChild(addHomeworkDropdown);
    }
  }
}

function showLoggedOutUI() {
  authContainer.style.display = "flex";
  appContent.style.display = "none";
  
  // Display first auth section (login)
  const authSections = document.querySelectorAll(".auth-section");
  authSections.forEach((section, index) => {
    section.style.display = index === 0 ? "block" : "none";
  });
}

// Toggle between Login/Signup forms
showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  const authSections = document.querySelectorAll(".auth-section");
  authSections[0].style.display = "none";
  authSections[1].style.display = "block";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const authSections = document.querySelectorAll(".auth-section");
  authSections[0].style.display = "block";
  authSections[1].style.display = "none";
});

// Login Form Submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      loginForm.reset();
    })
    .catch((error) => {
      alert("Eroare la conectare: " + error.message);
    });
});

// Signup Form Submit
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  
  if (password !== confirmPassword) {
    alert("Parolele nu coincid!");
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      signupForm.reset();
    })
    .catch((error) => {
      alert("Eroare la înregistrare: " + error.message);
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Format Date Function
function formatDate(dateString) {
  if (!dateString) return "N/A";

  if (dateString.includes('-')) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('ro-RO');
    }
  }

  return dateString;
}

// Set Default Date
function setDefaultDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  if (hw_duedate_input) {
    hw_duedate_input.value = `${year}-${month}-${day}`;
  }
}

// Create Homework Card
function createHomeworkCard(id, message, date, duedate, type, className) {
  const card = document.createElement("div");
  card.classList.add("hw-card");

  // Set card border color based on homework type
  switch (type) {
    case "Proiect":
      card.style.borderLeftColor = "#e74c3c"; 
      break;
    case "Temă":
      card.style.borderLeftColor = "#3498db"; 
      break;
    case "Prezentare":
      card.style.borderLeftColor = "#2ecc71"; 
      break;
    case "Altele":
      card.style.borderLeftColor = "#9b59b6"; 
      break;
    default:
      card.style.borderLeftColor = "#3498db"; 
  }

  const typeClassHeader = document.createElement("div");
  typeClassHeader.classList.add("type-class-header");

  const typeSpan = document.createElement("span");
  typeSpan.classList.add("hw-type");
  typeSpan.textContent = type;

  const classSpan = document.createElement("span");
  classSpan.classList.add("hw-class");
  classSpan.textContent = className;

  typeClassHeader.appendChild(typeSpan);
  typeClassHeader.appendChild(classSpan);

  const header = document.createElement("h3");
  header.textContent = message;

  const createdDate = document.createElement("p");
  createdDate.textContent = `Creat la: ${date}`;

  const dueDate = document.createElement("p");
  dueDate.textContent = `Până pe: ${formatDate(duedate)}`;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Șterge";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => removeHomework(id));

  card.appendChild(typeClassHeader);
  card.appendChild(header);
  card.appendChild(createdDate);
  card.appendChild(dueDate);
  card.appendChild(removeBtn);

  return card;
}

// Add Homework
hw_adder.addEventListener("click", () => {
  const userInput = hw_input.value.trim();
  const hw_type = hw_type_select.value;
  const hw_class = hw_class_select.value;
  const hw_duedate = hw_duedate_input.value.trim();
  const hw_added_date = new Date().toLocaleString('ro-RO');

  if (!userInput) {
    alert("Introdu un mesaj!");
    return;
  }

  if (hw_type === "default") {
    alert("Selectează un tip de temă!");
    return;
  }

  if (hw_class === "default") {
    alert("Selectează o materie!");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Trebuie să fii conectat pentru a adăuga teme!");
    return;
  }

  // Add to Firebase
  db.collection("homework").add({
    userId: user.uid,
    message: userInput,
    date: hw_added_date,
    duedate: hw_duedate,
    type: hw_type,
    class: hw_class,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    hw_input.value = "";
    hw_type_select.value = "default";
    hw_class_select.value = "default";
    hw_duedate_input.value = "";
    setDefaultDate();
    
    // Close dropdown after adding
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }

    // Reload homework
    loadHomework();
  })
  .catch((error) => {
    alert("Eroare la adăugarea temei: " + error.message);
  });
});

// Load Homework
function loadHomework() {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is currently logged in");
    hw_container.textContent = "Trebuie să fii conectat pentru a vedea temele!";
    return;
  }

  hw_container.innerHTML = "<p>Se încarcă temele...</p>";
  
  console.log("Attempting to load homework for user:", user.uid);
  
  db.collection("homework")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      console.log("Query executed successfully");
      console.log("Number of documents retrieved:", querySnapshot.size);
      
      hw_container.innerHTML = "";
      
      if (querySnapshot.empty) {
        hw_container.textContent = "Nu există teme salvate!";
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Document data:", data);
        
        const card = createHomeworkCard(
          doc.id,
          data.message,
          data.date,
          data.duedate,
          data.type,
          data.class
        );
        hw_container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading homework: ", error);
      hw_container.textContent = "Eroare la încărcarea temelor: " + error.message;
    });
}

function removeHomework(id) {
  if (confirm("Ești sigur că vrei să ștergi această temă?")) {
    db.collection("homework").doc(id).delete()
      .then(() => {
        loadHomework();
      })
      .catch((error) => {
        alert("Eroare la ștergerea temei: " + error.message);
      });
  }
}

// Delete All Homework
delete_all.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return;

  if (confirm("Ești sigur că vrei să ștergi toate temele?")) {
    db.collection("homework")
      .where("userId", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        const batch = db.batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .then(() => {
        loadHomework();
      })
      .catch((error) => {
        alert("Eroare la ștergerea temelor: " + error.message);
      });
  }
});

// Initialize on load
window.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();
});