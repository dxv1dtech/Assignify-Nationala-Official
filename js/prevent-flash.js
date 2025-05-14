(function() {
    const theme = localStorage.getItem("theme") || "dark";

    document.documentElement.style.backgroundColor = 
        theme === 'dark' ? '#1c1c1c' : "#f4f6f8";

    document.documentElement.classList.add('${theme}-mode');

})