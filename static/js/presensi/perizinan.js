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

// Untuk POST data ke data presensi
// Fungsi untuk mengirim data perizinan ke API
function submitPerizinan() {
	const selectedOption = document.querySelector('#statusSelect'); // Mengambil elemen select dengan class "form-select"
	const status = selectedOption ? selectedOption.value : ""; // Ambil status perizinan

	const lampiran = document.querySelector('#lampiranTextarea').value; // Ambil nilai lampiran

	const postData = {
		_id: _id,
		ket: status,
		lampiran: lampiran
	};

	fetch(`https://hris_backend.ulbi.ac.id/presensi/datapresensi/postdata/${_id}`, {
		method: "POST",
		headers: header,
		body: JSON.stringify(postData)
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

// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	// Untuk Ambil Element Form
	const form = document.getElementById('perizinanForm');

	// Untuk Cek apakah formnya valid atau tidak
	if (form.checkValidity()) {
		// Panggil fungsi submitPerizinan
		submitPerizinan();
	} else {
		form.reportValidity();
	}
});