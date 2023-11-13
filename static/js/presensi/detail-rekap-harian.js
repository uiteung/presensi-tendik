import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { getBadgeMarkupDetail, getStatusBadgeMarkupDetail } from "../style/badge.js"
import { html_table_to_excel } from "../style/xlsx-pdf.js"

// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

// Fungsi untuk menghitung rata-rata durasi dan persentase durasi
function calculateAverages(data) {
	const totalDuration = data.reduce((total, pulangEntry) => {
	  if (pulangEntry.durasi) {
		const durationParts = pulangEntry.durasi.split(" ");
		const hours = parseInt(durationParts[0]) || 0;
		const minutes = parseInt(durationParts[2]) || 0;
		const seconds = parseInt(durationParts[4]) || 0;
		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		return total + totalSeconds;
	  } else {
		return total;
	  }
	}, 0);
	const totalPercentage = data.reduce((total, pulangEntry) => {
	  if (pulangEntry.durasi) {
		const percentage = parseFloat(pulangEntry.durasi.replace("%", ""));
		return total + percentage;
	  } else {
		return total;
	  }
	}, 0);
	const averageDuration = totalDuration / data.length;
	const averagePercentage = totalPercentage / data.length;
  
	return { averageDuration, averagePercentage };
}

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

CihuyDomReady(() => {
    const tablebody = CihuyId("tablebodyMasuk");
    const buttonsebelumnya = CihuyId("prevPageBtnMasuk");
    const buttonselanjutnya = CihuyId("nextPageBtnMasuk");
    const halamansaatini = CihuyId("currentPageMasuk");
    const itemperpage = 5;
    let halamannow = 1;

    // Fetch Masuk Data
    fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian", requestOptions)
        .then((result) => result.json())
        .then((masukData) => {
            // Fetch Pulang Data
            fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulangharian", requestOptions)
                .then((result) => result.json())
                .then((pulangData) => {
                    // Combine data based on name and matching date
					const combinedData = masukData.data.map((masukEntry) => {
						const matchingPulangEntry = pulangData.data && pulangData.data.find((pulangEntry) =>
							pulangEntry.biodata.nama === masukEntry.biodata.nama &&
							new Date(pulangEntry.datetime).toLocaleDateString() === new Date(masukEntry.Datetime).toLocaleDateString()
						);
					
						return {
							masuk: masukEntry,
							pulang: matchingPulangEntry,
						};
					});

                    // Sort descending data
                    combinedData.sort((a, b) => new Date(b.masuk.Datetime) - new Date(a.masuk.Datetime));

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
                        const Durasi = pulangEntry ? pulangEntry.durasi : '0 Jam 0 Menit 0 Detik';
                        const persentaseStatus = pulangEntry ? parseFloat(pulangEntry.persentase) : 0;
                        const Persentase = pulangEntry ? pulangEntry.persentase : '0%';
                        const lampiranContent = lampiran ? lampiran : '<p>Tidak Ada Catatan</p>';

                        // Badge Condition for Entry
                        let ketBadgeMasuk = getBadgeMarkupDetail(ketMasuk);
                        let ketBadgePulang = getBadgeMarkupDetail(ketPulang);

                        let statusKerja = getStatusBadgeMarkupDetail(persentaseStatus);

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
                        `;
                    });

                    document.getElementById("tablebodyMasuk").innerHTML = tableData;

                    displayData(halamannow);
                    updatePagination();

                    // Calculate and Update Averages
                    const averages = calculateAverages(combinedData);
                    document.getElementById("averageDuration").textContent = `Rata-Rata Durasi : ${averages.averageDuration.toFixed(2)} detik`;
                    document.getElementById("averagePercentage").textContent = `Rata-Rata Persentase Durasi : ${averages.averagePercentage.toFixed(2)} %`;
                })
                .catch(error => {
                    console.log('error', error);
                });
        });

    function displayData(page) {
        const rows = CihuyQuerySelector("#tablebodyMasuk tr");
        const startIndex = (page - 1) * itemperpage;
        const endIndex = startIndex + itemperpage;

        for (let i = 0; i < rows.length; i++) {
            if (i >= startIndex && i < endIndex) {
                rows[i].style.display = "table-row";
            } else {
                rows[i].style.display = "none";
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
        const totalPages = Math.ceil(tablebody.querySelectorAll("#tablebodyMasuk tr").length / itemperpage);
        if (halamannow < totalPages) {
            halamannow++;
            displayData(halamannow);
            updatePagination();
        }
    });

    // Search Feature
    const searchInputMasuk = CihuyId("searchInputMasuk");
    const tableBodyMasuk = CihuyQuerySelector("#tablebodyMasuk tr");

    searchInputMasuk.addEventListener("input", function () {
        const searchText = searchInputMasuk.value.toLowerCase();

        for (const row of tableBodyMasuk) {
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