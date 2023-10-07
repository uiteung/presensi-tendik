import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

let employeeData;

// Ambil _id dari URL
const urlParams = new URLSearchParams(window.location.search);
const _id = urlParams.get('_id');

fetch(`https://hris_backend.ulbi.ac.id/presensi/datapresensi/getkaryawan/${_id}`, requestOptions)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		if (data && data.data) {
			employeeData = data.data;

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
	const employeeName = document.getElementById('employeeNameInput').value;
	const employeePosition = document.getElementById('employeePositionInput').value;
	const employeeWhatsapp = document.getElementById('employeeWhatsappInput').value;

	const updatedData = {
		nama: employeeName,
		jabatan: employeePosition,
		phone_number: employeeWhatsapp
	};

	// Compare updated data with existing data
	if (isDataChanged(employeeData, updatedData)) {
		showConfirmationAlert(updatedData);
	} else {
		showNoChangeAlert();
	}
});

// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
	return (
		existingData.nama !== newData.nama ||
		existingData.jabatan !== newData.jabatan ||
		existingData.phone_number !== newData.phone_number
	);
}

// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Perubahan Data Karyawan',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateEmployeeData(data);
		}
	});
}

// Fungsi untuk menampilkan alert jika tidak ada perubahan pada data
function showNoChangeAlert() {
	Swal.fire({
		icon: 'warning',
		title: 'Oops...',
		text : 'Tidak Ada Perubahan Data'
	});
}

// Untuk Update data ke data presensi
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
				Swal.fire({
					icon: 'success',
					title: 'Sukses!',
					text: 'Data Karyawan Berhasil Diperbarui',
					showConfirmButton: false,
					timer: 1500
				}).then(() => {
					window.location.href = 'seluruh-karyawan.html';
				});

				window.location.href = 'seluruh-karyawan.html';
			} else {
				// Menampilkan Data Alert Error
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Data Karyawan Gagal Diperbarui!',
				});
			}
		})
		.catch(error => {
			console.error("Error saat melakukan PATCH data:", error);
		});
}
