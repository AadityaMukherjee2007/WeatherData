const num = document.getElementById("numberOfRecords");
num.defaultValue = 5;

const record_div = document.getElementById("record-div");

document.querySelector("form").onsubmit = (event) => {
    event.preventDefault();

    fetch(`getData?n=${num.value}`)
    .then(request => request.json())
    .then(result => {
        console.log(result.data);

        result.data.forEach(dataset => {
            // console.log(dataset);

            const record = document.createElement("div");
            record.id = dataset.id;
            record.className = "records";
            record.innerHTML = `Time: ${dataset.timestamp}, Temp: ${dataset.temp_c}°C`;

            record_div.appendChild(record);
        });
    })
}