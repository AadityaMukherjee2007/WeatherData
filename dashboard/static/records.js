const num = document.getElementById("numberOfRecords");
const offset = document.getElementById("offset");
num.defaultValue = 5;
offset.defaultValue = 0;

const record_table = document.getElementById("record-table");

function displayData() {
    record_table.innerHTML = `
        <tr id="table-header">
            <th>id</th>
            <th>Timestamp</th>
            <th>Temperature (°C)</th>
            <th>Temperature (°F)</th>
            <th>Humidty (%)</th>
            <th>Heat Index (°C)</th>
            <th>Heat Index (°F)</th>
            <th>Pressure (hPa)</th>
            <th>Dew Point (°C)</th>
        </tr>
        <br>
    `;

    fetch(`getData?n=${num.value}&offset=${offset.value}`)
    .then(request => request.json())
    .then(result => {
        console.log(result.data);

        result.data.forEach(dataset => {
            const record = document.createElement("tr");
            record.id = dataset.id;
            record.className = "records";
            record.innerHTML = `
                <td>${dataset.id}</td>
                <td>${dataset.timestamp}</td>
                <td>${dataset.temp_c}</td>
                <td>${dataset.temp_f}</td> 
                <td>${dataset.humidity}</td>
                <td>${dataset.heatIndex_c}</td>
                <td>${dataset.heatIndex_f}</td>
                <td>${dataset.pressure}</td>
                <td>${dataset.dewPoint_c}</td>
            `;
            record_table.appendChild(record);
        });
    })
}

displayData();

document.querySelector("form").onsubmit = (event) => {
    event.preventDefault();
    displayData();
}