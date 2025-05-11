const citat_container = document.getElementById("citat");

let citate = [
    "Succesul este suma unor mici eforturi, repetate zi de zi",
    "Dacă nu țintiți spre nimic, îl veți reuși de fiecare dată",
    "Expertul în orice a fost cândva un începător",
    "Nu începe niciodată cu nu se poate, ci începe cu să vedem ",
    "Nu încerca sa devi o persoană de succes, ci una de valoare"
];


function load_citat() {
    if (!citat_container) return;
    
    let citat_random_id = Math.floor(Math.random() * citate.length);
    let citat_final = citate[citat_random_id];

    citat_container.innerHTML = "";

    const citat_h2 = document.createElement("h2");
    citat_h2.textContent = citat_final;
    citat_h2.style.fontStyle = "italic";
    citat_h2.style.fontSize = "clamp(1.2rem, 2vw, 1.8rem)";
    citat_h2.style.fontWeight = "600";
    citat_h2.style.marginBottom = "15px";
    citat_h2.style.color = "#555";

    citat_container.appendChild(citat_h2);
}

window.addEventListener("DOMContentLoaded", load_citat);