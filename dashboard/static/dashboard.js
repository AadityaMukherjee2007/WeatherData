document.addEventListener('DOMContentLoaded', function () {
    updateValues();
    dataDescription();
    initializeChart();

    setInterval(updateValues, 300000); // update values after 5 mins
});

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
            const padding = 12;
            const maxX = window.innerWidth - tooltip.offsetWidth - padding;
            const maxY = window.innerHeight - tooltip.offsetHeight - padding;
        
            tooltip.style.left = `${Math.min(e.clientX + padding, maxX)}px`;
            tooltip.style.top  = `${Math.min(e.clientY + padding, maxY)}px`;
        });

        card.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });
    });
}

let chart = null;
let currentOffset = 0;
const RECORDS_PER_VIEW = 12;

function initializeChart() {
    // Create navigation controls if they don't exist
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer && !document.getElementById('chart-nav')) {
        const navDiv = document.createElement('div');
        navDiv.id = 'chart-nav';
        navDiv.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin: 10px 0;';
        navDiv.innerHTML = `
            <button id="btn-older" style="padding: 8px 16px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc; background: #f0f0f0;">← Older</button>
            <span id="chart-info" style="padding: 8px 16px; align-self: center;">Loading...</span>
            <button id="btn-newer" style="padding: 8px 16px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc; background: #f0f0f0;">Newer →</button>
        `;
        chartContainer.parentNode.insertBefore(navDiv, chartContainer);

        document.getElementById('btn-newer').addEventListener('click', () => loadNewerData());
        document.getElementById('btn-older').addEventListener('click', () => loadOlderData());
    }

    updateChart();
}

function loadNewerData() {
    if (currentOffset > 0) {
        currentOffset = Math.max(0, currentOffset - RECORDS_PER_VIEW);
        updateChart();
    }
}

function loadOlderData() {
    currentOffset += RECORDS_PER_VIEW;
    updateChart();
}

function updateChart() {
    fetch(`/getData?n=${RECORDS_PER_VIEW}&offset=${currentOffset}`)
    .then(res => res.json())
    .then(result => {
        const data = result.data.reverse();

        if (data.length === 0) {
            // No more data, go back
            currentOffset = Math.max(0, currentOffset - RECORDS_PER_VIEW);
            document.getElementById('chart-info').textContent = 'No more data';
            return;
        }

        const labels = data.map(d =>
            new Date(d.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        );

        const temp = data.map(d => d.temp_c);
        const dew  = data.map(d => d.dewPoint_c);
        const heat = data.map(d => d.heatIndex_c);
        const pres = data.map(d => d.pressure);
        const hum  = data.map(d => d.humidity);

        const ctx = document.getElementById("chart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temp,
                        yAxisID: 'yTemp',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2
                    },
                    {
                        label: 'Dew Point (°C)',
                        data: dew,
                        yAxisID: 'yTemp',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Heat Index (°C)',
                        data: heat,
                        yAxisID: 'yTemp',
                        borderDash: [2, 4],
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Pressure (hPa)',
                        data: pres,
                        yAxisID: 'yPressure',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Humidity (%)',
                        data: hum,
                        yAxisID: 'yHumidity',
                        borderDash: [4, 4],
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    yTemp: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    yPressure: {
                        type: 'linear',
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Pressure (hPa)'
                        }
                    },
                    yHumidity: {
                        type: 'linear',
                        position: 'right',
                        offset: true,
                        min: 0,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        }
                    }
                }
            }
        });

        // Update navigation info
        const startRecord = currentOffset + 1;
        const endRecord = currentOffset + data.length;
        document.getElementById('chart-info').textContent = `Records ${startRecord}-${endRecord}`;
        
        // Enable/disable buttons
        document.getElementById('btn-newer').disabled = currentOffset === 0;
        document.getElementById('btn-older').disabled = data.length < RECORDS_PER_VIEW;
    })
    .catch(error => console.error('Error loading chart data:', error));
}