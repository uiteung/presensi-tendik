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
	const startDate = new Date(document.getElementById("startDate").value); // Ambil Tanggal Mulai
	const endDate = new Date(document.getElementById("endDate").value); // Ambil Tanggal Akhir

	const currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		const formattedDate = currentDate.toISOString().split('T')[0]; // Ubah tanggal ke format 'YYYY-MM-DD'
		
		const postData = {
			_id: _id,
			ket: status,
			lampiran: lampiran,
			tgl: formattedDate // Tambahkan tanggal ke data POST
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
				Swal.fire({
					icon: 'success',
					title: 'Sukses!',
					text: 'Data Perizinan Berhasil Ditambahkan',
					showConfirmButton: false,
					timer: 1500
				  }).then(() =>{
					window.location.href = 'sakit-izin.html';
				  });
			} else {
				// Menampilkan Data Alert Error
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Data Perizinan Gagal Ditambahkan!',
				  })
			}
		})
		.catch(error => {
			console.error("Error saat melakukan POST data:", error);
		});

		currentDate.setDate(currentDate.getDate() + 1); // Pindah ke tanggal berikutnya
}}

// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	// Get values from input fields
	const selectedOption = document.querySelector('#statusSelect').value;
	const lampiran = document.querySelector('#lampiranTextarea').value;
	const startDate = new Date(document.getElementById("startDate").value);
	const endDate = new Date(document.getElementById("endDate").value);

	// Untuk Ambil Element Form
	const form = document.getElementById('perizinanForm');
  
	// Check if any of the fields is empty
	if (!selectedOption || !lampiran || !startDate || !endDate) {
	  Swal.fire({
		icon: 'warning',
		title: 'Oops...',
		text: 'Semua field harus diisi!',
	  });
	  return; // Stop further processing
	}

	// Untuk Cek apakah formnya valid atau tidak
	if (form.checkValidity()) {
		// Tampilkan SweetAlert untuk konfirmasi
		Swal.fire({
			title: 'Submit Perizinan',
			text: 'Apakah anda yakin ingin submit perizinan?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				// Panggil fungsi submitPerizinan
				submitPerizinan();
			}
		});
	} else {
		form.reportValidity();
	}
});