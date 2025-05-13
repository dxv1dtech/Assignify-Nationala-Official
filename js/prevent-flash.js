(function() {
  let theme = localStorage.getItem("theme");
  
  if (!theme) {
    theme = "light";
  }
  
  document.documentElement.classList.add(`${theme}-mode`);
  document.body.classList.add(`${theme}-mode`);
})();