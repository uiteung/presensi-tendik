// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

// Untuk GET data dari API
fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi", requestOptions)
	.then((result) => {
		return result.json();
	})
	.then((response) => {
		console.log(token);
		if (response && response.data && response.data.length > 0) {

			let combinedData = {}; // Combined data of masuk and pulang records

			response.data.forEach((entry) => {
				const biodata = entry.biodata;
				const checkin = entry.checkin;
				const datetime = entry.datetime;
				const formattedDate = new Date(datetime).toISOString().split('T')[0];
				// const formattedDate = formatDateToIndonesian(datetime); // Change the date format

				if (!combinedData[biodata.nama]) {
					combinedData[biodata.nama] = {};
				}

				if (!combinedData[biodata.nama][formattedDate]) {
					combinedData[biodata.nama][formattedDate] = {
						masuk: null,
						pulang: null,
					};
				}

				if (checkin === "masuk") {
					combinedData[biodata.nama][formattedDate].masuk = new Date(datetime);
				} else if (checkin === "pulang") {
					combinedData[biodata.nama][formattedDate].pulang = new Date(datetime);
				}
			});

			let tableData = "";
			for (const nama in combinedData) {
				for (const date in combinedData[nama]) {
					const { masuk, pulang } = combinedData[nama][date];
					const masukTime = masuk ? masuk.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Masuk";
					const pulangTime = pulang ? pulang.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Pulang";
					const masukStatus = masuk ? "Masuk" : "";
					const pulangStatus = pulang ? "Pulang" : "";
					const biodata = response.data.find(entry => entry.biodata.nama === nama).biodata;

					// Tentukan keterangan badge "Masuk Kerja" jika sudah pulang
					const keterangan = pulangStatus
						? '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Kerja</span>'
						: '<a class="btn btn-warning" href="#">Sakit</a><span style="margin: 5px;"></span><a class="btn btn-primary" href="#">Izin</a>';

					// Tentukan apakah tombol "Uploud" akan muncul atau tidak
					const uploudButton = pulangStatus
						? '<span style="font-size: 13px;">Tidak Ada Catatan</span>'
						: '<a class="btn btn-info" style="color: white" href="#">Uploud</a>';

					// Sisanya kode pembuatan data tabel
					tableData += `
                      <tr>
                          <td>
                              <div class="d-flex align-items-center">
                                  <div class="ms-3">
                                      <p class="fw-bold mb-1">${nama}</p>
                                      <p class="text-muted mb-0">${biodata.phone_number}</p>
                                  </div>
                              </div>
                          </td>
                          <td>
                              <p class="fw-normal mb-1">${biodata.jabatan}</p>
                          </td>
                          <td>
                              <p class="fw-normal mb-1"><b>${masukStatus}</b> ${masukTime}</p>
                              <p class="fw-normal mb-1"><b>${pulangStatus}</b> ${pulangTime}</p>
                          </td>
                          <td>
                              <p class="fw-normal mb-1">${date}</p>
                          </td>
                          <td>
                              ${pulang && masuk
							? calculateDuration(masuk, pulang)
							: "0 Jam 0 Menit 0 Detik"
						}
                          </td>
                          <td>
                              ${pulang && masuk
							? calculatePercentage(masuk, pulang)
							: "0%"
						}
                          </td>
                          <td>
                              ${keterangan}
                          </td>
                          <td>
                             ${uploudButton}
                          </td>
                      </tr>`;
				}
			}

			document.getElementById("tablebody").innerHTML = tableData;

			// Untuk mencari rata-rata durasi kerja dan rata-rata persentase durasi kerja
			// Hitung total durasi dan total persentase durasi
			let totalDuration = 0;
			let totalPercentage = 0;

			// Hitung jumlah entitas untuk perhitungan rata-rata
			let entityCount = 0;
			for (const nama in combinedData) {
				for (const date in combinedData[nama]) {
					const { masuk, pulang } = combinedData[nama][date];

					if (masuk && pulang) {
						const durasi = pulang - masuk;
						const persentase = calculatePercentage(masuk, pulang);

						totalDuration += durasi;
						totalPercentage += parseFloat(persentase);
						entityCount++;
					}
				}
			}

			// Hitung rata-rata durasi dan rata-rata persentase
			const avgDuration =
				entityCount > 0 ? totalDuration / entityCount : 0;
			const avgPercentage =
				entityCount > 0 ? totalPercentage / entityCount : 0;

			// Masukkan nilai rata-rata ke dalam elemen HTML
			const avgDurationElement = document.getElementById("avgDuration");
			avgDurationElement.textContent = formatDuration(avgDuration);

			const avgPercentageElement = document.getElementById("avgPercentage");
			avgPercentageElement.textContent = avgPercentage.toFixed(2) + "%";
		} else {
			console.log('Sabar gblg');
		}
	})
	.catch(error => {
		console.log('error', error);
	});

// Fungsi untuk mengubah durasi menjadi format yang lebih mudah dibaca
function formatDuration(duration) {
	const durasiJam = Math.floor(duration / (1000 * 60 * 60));
	const durasiMenit = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
	const durasiDetik = Math.floor((duration % (1000 * 60)) / 1000);

	return `${durasiJam} Jam ${durasiMenit} Menit ${durasiDetik} Detik`;
}
// Fungsi perhitungan persentase durasi
function calculatePercentage(masukTime, pulangTime) {
	const durasi = pulangTime - masukTime;

	const durasiDetik = durasi / 1000;
	const totalDetikHadir = 8.5 * 60 * 60; // 8.5 jam * 60 menit * 60 detik

	const persentase = (durasiDetik / totalDetikHadir) * 100;

	return persentase.toFixed(2) + "%";
}

// Untuk membuat format Penanggalan
function formatDate(datetime) {
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	const formattedDate = new Date(datetime).toLocaleDateString('en-US', options);
	return formattedDate;
}
function formatDateToIndonesian(date) {
	const options = { day: 'numeric', month: 'long', year: 'numeric' };
	const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
	return formattedDate;
}

// Untuk menghitung durasi kerja
function calculateDuration(masukTime, pulangTime) {
	const durasi = pulangTime - masukTime;

	const durasiJam = Math.floor(durasi / (1000 * 60 * 60));
	const durasiMenit = Math.floor((durasi % (1000 * 60 * 60)) / (1000 * 60));
	const durasiDetik = Math.floor((durasi % (1000 * 60)) / 1000);

	return `${durasiJam} Jam ${durasiMenit} Menit ${durasiDetik} Detik`;
}


// Untuk membuat interaksi button export to excel dan pdf
function html_table_to_excel(type) {
	var data = document.getElementById('example');
	var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

	XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
	XLSX.writeFile(file, 'Data Rekap Presensi.' + type);
}

const export_button = document.getElementById('exportExcelBtn');
export_button.addEventListener('click', () => {
	html_table_to_excel('xlsx');
})

const exportPdfButton = document.getElementById('exportPdfBtn');
exportPdfButton.addEventListener('click', () => {
	const doc = new jsPDF();

	// You might need to adjust these values for styling and layout
	doc.text('Data Rekap Presensi', 10, 10);
	doc.autoTable({ html: '#example' });

	doc.save('Data Rekap Presensi.pdf');
});