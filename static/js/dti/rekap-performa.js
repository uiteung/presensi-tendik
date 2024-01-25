import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
// import { html_table_to_excel } from "../style/xlsx-pdf.js";
import { getBadgeMarkup, getStatusBadgeMarkup } from "../style/badge.js"

// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: header
};


// Untuk Get All data Presensi
CihuyDomReady(() => {
//   const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 8;
  let halamannow = 1;
  let filteredData = []; // To store the filtered data for search
  let totalData = 0;

  // Ambil data masuk
  fetch("https://hris_backend.ulbi.ac.id/api/v2/commits/rekapharian", requestOptions)
    .then((result) => result.json())
    .then((rekapharian) => {
        let rkp = rekapharian.data
          // Sortir array combinedData berdasarkan tanggal masuk
          rkp.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          
            console.log(rkp)
          // Inisialisasi data tabel
          totalData = rkp.length;
          filteredData = rkp;
          
          // Untuk Memunculkan Pagination Halamannya
          displayData(halamannow);
          updatePagination();

          // Button Pagination (Sebelumnya)
          buttonsebelumnya.addEventListener("click", () => {
            if (halamannow > 1) {
              halamannow--;
              displayData(halamannow);
              updatePagination();
            }
          });

          // Button Pagination (Selanjutnya)
          buttonselanjutnya.addEventListener("click", () => {
            const totalPages = Math.ceil(totalData / itemperpage);
            if (halamannow < totalPages) {
              halamannow++;
              displayData(halamannow);
              updatePagination();
            }
          })
    });

  // Fungsi Untuk Menampilkan Data
  function displayData(page) {
    const mulaiindex = (page - 1) * 8;
    const akhirindex = mulaiindex + 8;
    const rowsToShow = filteredData.slice(mulaiindex, akhirindex);

    let tableData = "";

    // Iterasi melalui rowsToShow dan membangun baris tabel
    rowsToShow.forEach((combinedEntry) => {

      // Ekstrak data yang relevan
      const nama = combinedEntry.staffName;
    //   const lampiran = masukEntry.lampiran;
      const ketMasuk = combinedEntry.presensi.ketMasuk;
      const ketPulang = combinedEntry.presensi.ketPulang;
      const jmlCommit = combinedEntry.total
      const email = combinedEntry.email
      const date = new Date(combinedEntry.date).toLocaleDateString();
      const jamMasuk = combinedEntry.presensi.presensiMasuk ? new Date(combinedEntry.presensi.presensiMasuk).toLocaleTimeString(): '' ;
      const jamPulang = combinedEntry.presensi.presensiPulang ? new Date(combinedEntry.presensi.presensPulang).toLocaleTimeString() : '';
    //   const Persentase = pulangEntry ? pulangEntry.persentase : '0%';
    //   const lampiranContent = lampiran ? lampiran : '<p>Tidak Ada Catatan</p>';

      // Pengkondisian Badge Keterangan
      let ketBadgeMasuk = getBadgeMarkup(ketMasuk);
      let ketBadgePulang = getBadgeMarkup(ketPulang);

    //   let statusKerja = getStatusBadgeMarkup(persentaseStatus);

      tableData += `
          <tr>
              <td>
                  <div class="d-flex align-items-center">
                      <div class="ms-3">
                          <p class="fw-bold mb-1">${nama}</p>
                          <p class="text-muted mb-0">${email}</p>
                      </div>
                  </div>
              </td>
              <td>
              <p class="fw-normal mb-1">${jamMasuk}</p>
              </td>
              <td style="text-align: center; vertical-align: middle">
              <p class="fw-normal mb-1"><b>${ketBadgeMasuk}</b></p>
              </td>
              <td>
                  <p class="fw-normal mb-1">${date}</p>
              </td>
              <td style="text-align: center; vertical-align: middle">
                  <p class="fw-normal mb-1">${jmlCommit}</p>
              </td>
              <td>
              <p class="fw-normal mb-1">${jamPulang}</p>
              </td>
              <td style="text-align: center; vertical-align: middle">
              <p class="fw-normal mb-1"><b>${ketBadgePulang}</b></p>
              </td>
          </tr>
      `;
    });

    document.getElementById("tablebody").innerHTML = tableData;
  }

  // Fungsi Untuk Update Pagination
  function updatePagination() {
    halamansaatini.textContent = `Halaman ${halamannow}`;
  }
});