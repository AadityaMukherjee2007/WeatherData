document.addEventListener('DOMContentLoaded', function () {
    updateValues();

    setInterval(displayTime, 1000);
    setInterval(updateValues, 480000); // update values after 7 mins
})

function displayTime() {
    const time_div = document.getElementById("time_div");

    const now = new Date();
    time_div.textContent = now.toLocaleTimeString();
}

function updateValues() {
    const temp_val = document.getElementById('temp-val');
    const atm_val = document.getElementById('atm-val');

    fetch('/getCurrentData')
    .then(request => request.json())
    .then(data => {
        console.log(data);
        
        temp_val.textContent = `${data['temperature']}°C`;
        atm_val.textContent = `${data['pressure']} hPa`;
    })
    .catch(error => console.error(error));
}
