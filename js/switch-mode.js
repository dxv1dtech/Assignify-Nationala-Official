const switchbutton = document.getElementById("switchmodebutton");
const body = document.body;
let mode = "light";

body.style.backgroundColor = "white";

switchbutton.addEventListener("click", () => {
    if (mode === "light") {
        mode = "dark";
        body.style.backgroundColor = "black";
    } else {
        mode = "light";
        body.style.backgroundColor = "white";
    }
});