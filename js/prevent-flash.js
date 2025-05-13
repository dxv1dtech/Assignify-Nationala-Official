// prevent-flash.js - Simplified version
(function() {
  // Get theme from localStorage or default to dark
  const theme = localStorage.getItem("theme") || "dark";
  
  // Set the background color immediately using an inline style
  // This is the most direct way to prevent any flash
  document.documentElement.style.backgroundColor = 
    theme === 'dark' ? '#1c1c1c' : '#f4f6f8';
  
  // Also add the class for other styling
  document.documentElement.classList.add(`${theme}-mode`);
})();