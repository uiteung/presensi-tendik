import { token } from "../controller/cookies.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

// Untuk membuat interaksi button export to excel dan pdf
function html_table_to_excel(type) {
	var data = document.getElementById('exampleBelumMasuk');
	var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

	XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
	XLSX.writeFile(file, 'Rekap Belum Presensi Masuk Harian.' + type);
}

const export_button = document.getElementById('exportExcelBtnBelumMasuk');
export_button.addEventListener('click', () => {
	html_table_to_excel('xlsx');
})

const exportPdfButton = document.getElementById('exportPdfBtnBelumMasuk');
exportPdfButton.addEventListener('click', () => {
	const doc = new jsPDF({ orientation: 'landscape' });
	doc.text('Rekap Belum Presensi Masuk Harian', 10, 10);
	const rows = document.getElementById('exampleBelumMasuk').querySelectorAll('tr');
	const tableData = [];
	const headers = ['Nama', 'Posisi', 'Status', 'Tanggal', 'Keterangan', 'Link Dokumen'];
	tableData.push(headers);
	rows.forEach(row => {
		const rowData = [];
		row.querySelectorAll('td').forEach(cell => {
			rowData.push(cell.innerText);
		});
		tableData.push(rowData);
	});
	const colWidths = [60, 40, 40, 40, 40, 40]; // Set the column widths (you can adjust these values)
	const rowHeight = 10; 	// Set the row height (you can adjust this value)
	doc.autoTable({
		head: [headers],
		body: tableData.slice(1), // Exclude headers from the body
		columnStyles: { 0: { columnWidth: colWidths[0] }, 1: { columnWidth: colWidths[1] }, 2: { columnWidth: colWidths[2] }, 3: { columnWidth: colWidths[3] }, 4: { columnWidth: colWidths[4] }, 5: { columnWidth: colWidths[5] } },
		margin: { top: 20 }, // Adjust top margin for better layout
		rowPageBreak: 'avoid', // Avoid breaking rows between pages
		headStyles: { fillColor: [41, 128, 185] }, // Set header fill color
		styles: { fontSize: 10, cellPadding: 3, valign: 'middle', halign: 'center', minCellHeight: rowHeight },
	});
	doc.save('Rekap Belum Presensi Masuk Harian.pdf');
});

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyBelumMasuk");
	const buttonsebelumnya = CihuyId("prevPageBtnBelumMasuk");
	const buttonselanjutnya = CihuyId("nextPageBtnBelumMasuk");
	const halamansaatini = CihuyId("currentPageBelumMasuk");
	const itemperpage = 5;
	let halamannow = 1;

	fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian", requestOptions)
		.then((result) => {
			return result.json();
		})
		.then((presensiData) => {
			const karyawanYangSudahPresensi = presensiData.data.map(entry => entry.biodata.nama);

			fetch("https://hris_backend.ulbi.ac.id/presensi/datakaryawan", requestOptions)
				.then((result) => {
					return result.json();
				})
				.then((data) => {
					const karyawanBelumPresensi = data.data.filter(karyawan => !karyawanYangSudahPresensi.includes(karyawan.nama));

					let tableData = "";
					karyawanBelumPresensi.map((values) => {
						tableData += `
                        <tr>
                            <td>
                                <p class="fw-normal mb-1">${values.nama}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle;">
                                <p>${values.phone_number}</p>
                            </td>
                            <td>
                                <p class="fw-normal mb-1">${values.jabatan}</p>
                            </td>
							<td style="text-align: center; vertical-align: middle;">
                                <span class=badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px; ">Tidak Absen Masuk</span>
                            </td>
                        </tr>`;
					});

					document.getElementById("tablebodyBelumMasuk").innerHTML = tableData;

					displayData(halamannow);
					updatePagination();
				})
				.catch(error => {
					console.log('error', error);
				});
		})
		.catch(error => {
			console.log('error', error);
		});

	function displayData(page) {
		const baris = CihuyQuerySelector("#tablebodyBelumMasuk tr");
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
			tablebody.querySelectorAll("#tablebodyBelumMasuk tr").length / itemperpage
		);
		if (halamannow < totalPages) {
			halamannow++;
			displayData(halamannow);
			updatePagination();
		}
	});
});

// Membuat fitur search
document.addEventListener("DOMContentLoaded", function () {
	const searchInput = document.getElementById("searchInputBelumMasuk");
	const tableBody = document.getElementById("tablebodyBelumMasuk").getElementsByTagName("tr");

	searchInput.addEventListener("input", function () {
		const searchText = searchInput.value.toLowerCase();

		for (const row of tableBody) {
			const cells = row.getElementsByTagName("td");
			let rowMatchesSearch = false;

			for (const cell of cells) {
				if (cell.textContent.toLowerCase().includes(searchText)) {
					rowMatchesSearch = true;
					break;
				}
			}

			row.style.display = rowMatchesSearch ? "" : "none";
		}
	});
});