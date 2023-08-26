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