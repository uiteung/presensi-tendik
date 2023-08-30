// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

// Ambil _id dari URL
const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id');

fetch(`https://hris_backend.ulbi.ac.id/presensi/datapresensi/getkaryawan/${_id}`, requestOptions)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		if (data && data.data) {
			const employeeData = data.data; // Data karyawan langsung diambil dari data.data

			// Tampilkan data karyawan ke dalam form
			document.getElementById("employeeNameInput").value = employeeData.nama;
			document.getElementById("employeePositionInput").value = employeeData.jabatan;
			document.getElementById("employeeWhatsappInput").value = employeeData.phone_number;
			
		} else {
			console.log('Data karyawan tidak ditemukan.');
		}
	})
	.catch(error => {
		console.log('error', error);
	});

// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const form = document.getElementById('editkaryawan');

	const employeeName = document.getElementById('employeeNameInput').value;
	const employeePosition = document.getElementById('employeePositionInput').value;
	const employeeWhatsapp = document.getElementById('employeeWhatsappInput').value;

	const updatedData = {
		nama: employeeName,
		jabatan: employeePosition,
		phone_number: employeeWhatsapp
	};
		updateEmployeeData(updatedData); // Panggil fungsi dengan parameter data
});

// Untuk Update data ke data presensi
// Fungsi untuk mengirim data perizinan ke API
function updateEmployeeData(data) {
	fetch(`https://hris_backend.ulbi.ac.id/presensi/datakaryawan/updatedata/${_id}`, {
		method: "PATCH",
		headers: header,
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				// Menampilkan Data Alert Success
				const alertContainer = document.querySelector('#alertContainer');
				const alertDiv = document.createElement('div');
				alertDiv.classList.add('alert', 'alert-success', 'mt-3');
				alertDiv.textContent = 'Data Berhasil Ditambahkan';
				alertContainer.appendChild(alertDiv);
			
				// Alihkan ke halaman sakit-izin.html setelah alert muncul
				setTimeout(() => {
					window.location.href = 'seluruh-karyawan.html';
				}, 1000); // Mengalihkan setelah 2 detik (2000 milidetik)
			} else {
				// Menampilkan Data Alert Error
				const alertContainer = document.querySelector('#alertContainer');
				const alertDiv = document.createElement(`div`);
				alertDiv.classList.add('alert', 'alert-danger', 'mt-3');
				alertDiv.textContent = 'Data Gagal Ditambahkan';
				alertContainer.appendChild(alertDiv);
			}
		})
		.catch(error => {
			console.error("Error saat melakukan POST data:", error);
		});
}
