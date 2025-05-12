
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme");

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      const userRef = db.collection("users").doc(user.uid);

      userRef.get().then(doc => {
        const theme = doc.exists && doc.data().theme ? doc.data().theme : "light";
        applyTheme(theme);
      });

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
          applyTheme(newTheme);
          userRef.set({ theme: newTheme }, { merge: true });
        });
      }
    } else {
      const theme = localStorage.getItem("theme") || "light";
      applyTheme(theme);
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
          applyTheme(newTheme);
          localStorage.setItem("theme", newTheme);
        });
      }
    }
  });

  function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
  }
});
