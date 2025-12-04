document.addEventListener('DOMContentLoaded', function () {
    // alert("Script loaded!");
    setInterval(displayTime, 1000);
})

function displayTime() {
    const time_div = document.getElementById("time_div");

    const now = new Date();
    time_div.textContent = now.toLocaleTimeString();
}