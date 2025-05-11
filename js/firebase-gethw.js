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

// DOM Element
const recentHwContainer = document.getElementById("mostrecenthw");

// Format Date Function
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('ro-RO');
  }
  
  return dateString;
}

// Create Homework Card
function createHomeworkCard(message, duedate, type, className) {
  const div = document.createElement("div");
  div.classList.add("hw-card");
  
  // Set card border color based on homework type
  switch(type) {
    case "Proiect": div.style.borderLeftColor = "#e74c3c"; break;
    case "Temă": div.style.borderLeftColor = "#3498db"; break;
    case "Prezentare": div.style.borderLeftColor = "#2ecc71"; break;
    case "Altele": div.style.borderLeftColor = "#9b59b6"; break;
    default: div.style.borderLeftColor = "#3498db";
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

  const title = document.createElement("h2");
  title.textContent = message;

  const due = document.createElement("p");
  due.textContent = `Deadline: ${formatDate(duedate)}`;

  div.appendChild(typeClassHeader);
  div.appendChild(title);
  div.appendChild(due);
  
  return div;
}

// Parse Date for sorting
function parseDate(dateStr) {
  if (!dateStr) return Infinity;
  
  const timestamp = new Date(dateStr).getTime();
  return isNaN(timestamp) ? Infinity : timestamp;
}

// Display homework
function displayHomework(homeworkList) {
  recentHwContainer.innerHTML = "";
  
  const sortedHomework = homeworkList
    .filter(hw => hw.parsedDue !== Infinity)
    .sort((a, b) => a.parsedDue - b.parsedDue)
    .slice(0, 3);

  if (sortedHomework.length === 0) {
    recentHwContainer.textContent = "Nu există teme cu termen apropiat.";
    return;
  }

  sortedHomework.forEach(hw => {
    const card = createHomeworkCard(
      hw.message,
      hw.due,
      hw.type,
      hw.className
    );
    recentHwContainer.appendChild(card);
  });
}

// Load Recent Homework from Firebase
function loadRecentHomework() {
  if (!recentHwContainer) {
    console.error("Recent homework container not found");
    return;
  }
  
  recentHwContainer.innerHTML = "<p>Se încarcă temele recente...</p>";
  
  // Try to get current user (if logged in)
  try {
    const auth = firebase.auth();
    
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in, fetch homework from Firebase
        const db = firebase.firestore();
        
        db.collection("homework")
          .where("userId", "==", user.uid)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              recentHwContainer.textContent = "Nu există teme recente.";
              return;
            }
            
            // Extract homework data
            const homeworkList = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              homeworkList.push({
                message: data.message,
                due: data.duedate,
                parsedDue: parseDate(data.duedate),
                type: data.type || "Temă",
                className: data.class || "General"
              });
            });
            
            displayHomework(homeworkList);
          })
          .catch((error) => {
            console.error("Error loading homework:", error);
            recentHwContainer.textContent = "Eroare la încărcarea temelor.";
          });
      } else {
        // User is not logged in, show login message
        recentHwContainer.innerHTML = "<p>Conectează-te pentru a vedea temele recente. (Intră pe pagina - Manager de teme - pentru a te loga)</p>";
        recentHwContainer.style.marginTop = "10px";
      }
    }, (error) => {
      console.error("Auth state error:", error);
      recentHwContainer.textContent = "Eroare la verificarea autentificării.";
    });
  } catch (error) {
    console.error("Firebase auth error:", error);
    recentHwContainer.textContent = "Eroare la inițializarea Firebase Auth.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    loadRecentHomework();
  } catch (error) {
    console.error("Firebase error:", error);
    recentHwContainer.textContent = "Eroare la încărcarea temelor.";
  }
});