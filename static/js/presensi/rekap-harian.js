import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
    method: "GET",
    headers: header
};

// Untuk GET data di Rekap Harian Masuk
document.addEventListener("DOMContentLoaded", function() {
    const initialData = [0, 0, 0, 0, 0]; // Initialize with zeros for each category
    
    const doughnutChart = new Chart(document.getElementById("chartjs-doughnut"), {
        type: "doughnut",
        data: {
            labels: ["Tepat Waktu", "Lebih Cepat", "Terlambat", "Sakit", "Izin"],
            datasets: [{
                data: initialData,
                backgroundColor: [
                    window.theme.primary,
                    window.theme.success,
                    window.theme.danger,
                    window.theme.warning,
                    "#ff8700"
                ],
                borderColor: "transparent"
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutoutPercentage: 65,
            legend: {
                display: false
            }
        }
    });

    // Make API request to get updated data
    fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Print data to console to understand its structure
            if (data && data.success && data.data) {
                const newData = [0, 0, 0, 0, 0]; // Initialize with zeros for each category

                data.data.forEach(entry => {
                    switch (entry.ket) {
                        case "Tepat Waktu":
                            newData[0]++;
                            break;
                        case "Lebih Cepat":
                            newData[1]++;
                            break;
                        case "Terlambat":
                            newData[2]++;
                            break;
                        case "Sakit":
                            newData[3]++;
                            break;
                        case "Izin":
                            newData[4]++;
                            break;
                        default:
                            break;
                    }
                });

                // Update chart data
                doughnutChart.data.datasets[0].data = newData;
                // Update the chart
                doughnutChart.update();
            } else {
                console.error("Data is null or missing.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});


// Untuk GET data harian pulang
document.addEventListener("DOMContentLoaded", function() {
    const initialData = [0, 0, 0, 0, 0]; // Initialize with zeros for each category
    
    const doughnutChart = new Chart(document.getElementById("chartjs-pie"), {
        type: "pie",
        data: {
            labels: ["Tepat Waktu", "Lebih Lama", "Lebih Cepat"],
            datasets: [{
                data: initialData,
                backgroundColor: [
                    window.theme.primary,
                    window.theme.success,
                    window.theme.danger,
                ],
                borderColor: "transparent"
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            }
        }
    });

    // Make API request to get updated data
    fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulangharian", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Print data to console to understand its structure
            if (data && data.success && data.data) {
                const newData = [0, 0, 0, 0, 0]; // Initialize with zeros for each category

                data.data.forEach(entry => {
                    switch (entry.ket) {
                        case "Tepat Waktu":
                            newData[0]++;
                            break;
                        case "Lebih Cepat":
                            newData[1]++;
                            break;
                        case "Terlambat":
                            newData[2]++;
                            break;
                        case "Sakit":
                            newData[3]++;
                            break;
                        case "Izin":
                            newData[4]++;
                            break;
                        default:
                            break;
                    }
                });

                // Update chart data
                doughnutChart.data.datasets[0].data = newData;
                // Update the chart
                doughnutChart.update();
            } else {
                console.error("Data is null or missing.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});