document.addEventListener('DOMContentLoaded', function () {
    updateValues();
    dataDescription();

    setInterval(displayTime, 1000);
    setInterval(updateValues, 300000); // update values after 5 mins
})

function displayTime() {
    const time_div = document.getElementById("time_div");

    const now = new Date();
    time_div.textContent = now.toLocaleTimeString();
}

function updateValues() {
    const temp_val = document.getElementById('temp-val');
    const temp_val_f = document.getElementById('temp-val-f');
    const HI_val = document.getElementById('HI-val');
    const HI_val_f = document.getElementById('HI-val-f');
    const humidity_val = document.getElementById('humidity-val');
    const dewpoint_val = document.getElementById('dewpoint-val');
    const atm_val = document.getElementById('atm-val');

    fetch('/getCurrentData')
    .then(request => request.json())
    .then(data => {
        console.log(data);
        
        temp_val.textContent = `${data['temp_c']}°C`;
        temp_val_f.textContent = `${data['temp_f']}°F`;
        HI_val.textContent = `${data['heatIndex_c']}°C`;
        HI_val_f.textContent = `${data['heatIndex_f']}°F`;
        humidity_val.textContent = `${data['humidity']}%`;
        dewpoint_val.textContent = `${data['dewPoint_c']}°C`;
        atm_val.textContent = `${data['pressure']} hPa`;
    })
    .catch(error => console.error(error));
}

function dataDescription() {
    const tooltip = document.getElementById("tooltip");
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            tooltip.textContent = card.dataset.description;
            tooltip.style.opacity = 1;
        });

        card.addEventListener("mousemove", (e) => {
            const offsetX = 60;  
            const offsetY = 60;  
            tooltip.style.left = `${e.clientX + offsetX}px`;
            tooltip.style.top = `${e.clientY + offsetY}px`;
        });

        card.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });
    });
}
