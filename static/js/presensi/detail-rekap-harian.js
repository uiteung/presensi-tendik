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
	var data = document.getElementById('exampleMasuk');
	var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
	XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
	XLSX.writeFile(file, 'Rekap Presensi Masuk Harian.' + type);
}
const export_button = document.getElementById('exportExcelBtnMasuk');
export_button.addEventListener('click', () => {
	html_table_to_excel('xlsx');
})

const exportPdfButton = document.getElementById('exportPdfBtnMasuk');
exportPdfButton.addEventListener('click', () => {
	const doc = new jsPDF({ orientation: 'landscape' });
	doc.text('Rekap Presensi Masuk Harian', 10, 10);
	const rows = document.getElementById('exampleMasuk').querySelectorAll('tr');
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
	doc.save('Rekap Presensi Masuk Harian.pdf');
});

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyMasuk");
	const buttonsebelumnya = CihuyId("prevPageBtnMasuk");
	const buttonselanjutnya = CihuyId("nextPageBtnMasuk");
	const halamansaatini = CihuyId("currentPageMasuk");
	const itemperpage = 5;
	let halamannow = 1;

    // Ambil Data Masuk
	fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian", requestOptions)
		.then((result) => result.json())
		.then((masukData) => {
            // Ambil Data Pulang
            fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulangharian", requestOptions)
            .then((result) => result.json())
            .then((pulangData) => {
                // Gabungkan data berdasarkan nama dan tanggal yang sesuai
                const combinedData = masukData.data.map((masukEntry) => {
                    const matchingPulangEntry = pulangData.data.find((pulangEntry) =>
                    pulangEntry.biodata.nama === masukEntry.biodata.nama && new Date(pulangEntry.datetime).toLocaleDateString() === new Date(masukEntry.Datetime).toLocaleDateString()
                    );
                    
                    return {
                        masuk: masukEntry,
                        pulang: matchingPulangEntry,
                    };
                });
            
			// Sorting descending data
			combinedData.sort((a, b) => new Date(b.Datetime) - new Date(a.Datetime));

			let tableData = "";
            
			combinedData.forEach((combinedEntry) => {
                const masukEntry = combinedEntry.masuk;
                const pulangEntry = combinedEntry.pulang;

				const nama = masukEntry.biodata.nama;
				const lampiran = masukEntry.lampiran;
				const ketMasuk = masukEntry?.ket;
                const ketPulang = pulangEntry?.ket;
				const date = new Date(masukEntry.Datetime).toLocaleDateString();
				const jamMasuk = new Date(masukEntry.Datetime).toLocaleTimeString();
                const jamPulang = pulangEntry ? new Date(pulangEntry.datetime).toLocaleTimeString() : '';
                const Durasi = pulangEntry ? pulangEntry.durasi : '-';
                const persentaseStatus = pulangEntry ? parseFloat(pulangEntry.persentase) : 0;
                const Persentase = pulangEntry ? pulangEntry.persentase : '-';
                const lampiranContent = lampiran ? lampiran : '<p>Tidak Ada Catatan</p>';

                // Pengkondisian Badge Keterangan
                let ketBadgeMasuk = '';
                if (ketMasuk === 'Lebih Cepat') {
                ketBadgeMasuk = '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Lebih Cepat</span>';
                } else if (ketMasuk === 'Tepat Waktu') {
                ketBadgeMasuk = '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Tepat Waktu</span>';
                } else if (ketMasuk === 'Terlambat') {
                ketBadgeMasuk = '<span class=badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Terlambat</span>';
                } else if (ketMasuk === 'Sakit') {
                ketBadgeMasuk = '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Sakit</span>';
                } else if (ketMasuk === 'izin') {
                ketBadgeMasuk = '<span class=badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Izin</span>'
                } else {
                ketBadgeMasuk = "<span>Belum Absen Masuk</span>";
                }

                // Pengkondisian Badge Keterangan
                let ketBadgePulang = '';
                if (ketPulang === 'Lebih Cepat') {
                ketBadgePulang = '<span class="badge-green" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Lebih Cepat</span>';
                } else if (ketPulang === 'Tepat Waktu') {
                ketBadgePulang = '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Tepat Waktu</span>';
                } else if (ketPulang === 'Lebih Lama') {
                ketBadgePulang = '<span class=badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Lebih Lama</span>';
                } else {
                ketBadgePulang = "<span>Belum Absen Pulang</span>";
                }

                let statusKerja = '';
                if (persentaseStatus >= 100) {
                statusKerja = '<span class=badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Tuntas</span>'
                } else if (persentaseStatus < 100) {
                statusKerja = '<span class=badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Belum Tuntas</span>';
                } else {
                statusKerja = '';
                }

				tableData += `
                <tr>
                <td>
                    <div class="d-flex align-items-center">
                            <div class="ms-3">
                                <p class="fw-bold mb-1">${nama}</p>
                                <p class="text-muted mb-0">${masukEntry.phone_number}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">${masukEntry.biodata.jabatan}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1"><b>${ketBadgeMasuk}</b> ${jamMasuk}</p>
                        <p class="fw-normal mb-1"><b>${ketBadgePulang}</b> ${jamPulang}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${date}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${Durasi}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${Persentase}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${statusKerja}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${lampiranContent}</p>
                    </td>
                </tr>
                `
			})
			document.getElementById("tablebodyMasuk").innerHTML = tableData;

			displayData(halamannow);
			updatePagination();
		})
		.catch(error => {
			console.log('error', error);
		});

	function displayData(page) {
		const baris = CihuyQuerySelector("#tablebodyMasuk tr");
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
			tablebody.querySelectorAll("#tablebodyMasuk tr").length / itemperpage
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
	const searchInput = document.getElementById("searchInputMasuk");
	const tableBody = document.getElementById("tablebodyMasuk").getElementsByTagName("tr");

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
    })
});