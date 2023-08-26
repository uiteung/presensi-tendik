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

// Untuk Membuat Pagination
CihuyDomReady(() => {
  const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 5;
  let halamannow = 1;

  fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian", requestOptions)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      // Sorting descending data
      data.data.sort((a, b) => new Date(b.Datetime) - new Date(a.Datetime));

      let tableData = "";
      data.data.map((entry) => {
        const nama = entry.biodata.nama;
        const checkin = entry.checkin;
        const lampiran = entry.lampiran;
        const ket = entry.ket;
        const date = new Date(entry.Datetime).toLocaleDateString(); 
        const jamMasuk = new Date(entry.Datetime).toLocaleTimeString();

        // Pengkondisian Badge Keterangan
        let ketBadge = '';
        if (ket === 'Lebih Cepat') {
          ketBadge = '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Lebih Cepat</span>';
        } else if (ket === 'Tepat Waktu') {
          ketBadge = '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Tepat Waktu</span>';
        } else if (ket === 'Terlambat') {
          ketBadge = '<span class=badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Terlambat</span>';
        } else if (ket === 'Sakit') {
          ketBadge = '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Sakit</span>';
        } else if (ket === 'izin') {
          ketBadge = '<span class=badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Izin</span>'
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
                <p class="fw-normal mb-1"><b>${checkin}</b></p>
                <p>${jamMasuk}</p>
            </td>
            <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${date}</p>
            </td>
            <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${ketBadge}</p>
            </td>
            <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${lampiranContent}</p>
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