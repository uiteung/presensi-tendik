// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

document.addEventListener("DOMContentLoaded", function () {
	// Get references to the select element and input field
	const employeeNameDropdown = document.getElementById("employeeNameDropdown");
	const employeePositionInput = document.getElementById("employeePositionInput");
	const employeeWhatsappInput = document.getElementById("employeeWhatsappInput")

	// Fetch data from the API
	fetch("https://hris_backend.ulbi.ac.id/presensi/datakaryawan", requestOptions)
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				data.data.forEach(employee => {
					// Populate name dropdown
					const nameOption = document.createElement("option");
					nameOption.value = employee.nama;
					nameOption.text = employee.nama;
					employeeNameDropdown.appendChild(nameOption);
				});

				// Add event listener to name dropdown
				employeeNameDropdown.addEventListener("change", function () {
					const selectedName = this.value;
					const selectedEmployee = data.data.find(employee => employee.nama === selectedName);
					if (selectedEmployee) {
						employeePositionInput.value = selectedEmployee.jabatan;
						employeeWhatsappInput.value = selectedEmployee.phone_number;
					}
				});
			} else {
				console.error("Failed to fetch data from the API");
			}
		})
		.catch(error => {
			console.error("Error fetching data:", error);
		});
});
