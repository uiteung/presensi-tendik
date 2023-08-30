import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";

// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

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
	const doc = new jsPDF({ orientation: 'landscape' });

	// You might need to adjust these values for styling and layout
	doc.text('Data Rekap Presensi', 10, 10);
	doc.autoTable({ html: '#example' });

	doc.save('Data Rekap Presensi.pdf');
});

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtnSakit");
	const buttonselanjutnya = CihuyId("nextPageBtnSakit");
	const halamansaatini = CihuyId("currentPageSakit");
	const itemperpage = 8;
	let halamannow = 1;

	fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi", requestOptions)
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			// Sorting descending data
			data.data.sort((a, b) => new Date(b.Datetime) - new Date(a.Datetime));

			// Untuk Filter data yang sakit dan izin saja
			const filteredData = data.data.filter(entry => entry.ket === 'Sakit' || entry.ket === 'Izin');

			let tableData = "";
			filteredData.map((entry) => {
				const nama = entry.biodata.nama;
				const checkin = entry.checkin;
				const lampiran = entry.lampiran;
				const ket = entry.ket;
				const date = new Date(entry.Datetime).toLocaleDateString();

				// Pengkondisian Badge Keterangan
				let ketBadge = '';
				if (ket === 'Izin') {
					ketBadge = '<span class=badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Izin</span>';
				} else if (ket === 'Sakit') {
					ketBadge = '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Sakit</span>';
				} else {
					ketBadge = "";
				}

				const lampiranContent = lampiran ? lampiran : '<p>Tidak ada Catatan</p>';

				tableData += `
				<tr>
				<td>
					<div class="d-flex align-items-center">
							<div class="ms-3">
								<p class="fw-bold mb-1">${nama}</p>
								<p class="text-muted mb-0">${entry.phone_number}</p>
							</div>
						</div>
					</td>
					<td>
						<p class="fw-normal mb-1">${entry.biodata.jabatan}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${date}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${ketBadge}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<a href="${lampiranContent}" class="fw-normal mb-1">Buka Link Dokumen</a>
					</td>
				</tr>
				`
			})
			document.getElementById("tablebody").innerHTML = tableData;

			displayData(halamannow);
			updatePagination();
		})
		.catch(error => {
			console.log('error', error);
		});

	function displayData(page) {
		const baris = CihuyQuerySelector("#tablebody tr");
		const mulaiindex = (page - 1) * itemperpage;
		const akhirindex = mulaiindex + itemperpage;

		for (let i = 0; i < baris.length; i++) {
			if (i >= mulaiindex && i < akhirindex) {
				baris[i].style.display = "table-row";
			} else {
				baris[i].style.display = "none";
			}
		}
	}
	function updatePagination() {
		halamansaatini.textContent = `Halaman ${halamannow}`;
	}

	buttonsebelumnya.addEventListener("click", () => {
		if (halamannow > 1) {
			halamannow--;
			displayData(halamannow);
			updatePagination();
		}
	});

	buttonselanjutnya.addEventListener("click", () => {
		const totalPages = Math.ceil(
			tablebody.querySelectorAll("#tablebody tr").length / itemperpage
		);
		if (halamannow < totalPages) {
			halamannow++;
			displayData(halamannow);
			updatePagination();
		}
	});

});