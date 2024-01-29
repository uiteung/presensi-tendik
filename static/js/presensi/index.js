import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { html_table_to_excel } from "../style/xlsx-pdf.js";
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
  const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 8;
  let halamannow = 1;
  let filteredData = []; // To store the filtered data for search
  let totalData = 0;

  // Ambil data masuk
  fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi", requestOptions)
    .then((result) => result.json())
    .then((masukData) => {
      // Ambil data pulang
      fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulang", requestOptions)
        .then((result) => result.json())
        .then((pulangData) => {
          // Gabungkan data berdasarkan nama dan tanggal yang sesuai
          const combinedData = masukData.data.map((masukEntry) => {
            const matchingPulangEntry = pulangData.data.find((pulangEntry) =>
              pulangEntry.biodata.nama === masukEntry.biodata.nama &&
              new Date(pulangEntry.datetime).toLocaleDateString() === new Date(masukEntry.Datetime).toLocaleDateString()
            );

            return {
              masuk: masukEntry,
              pulang: matchingPulangEntry,
            };
          });

          // Sortir array combinedData berdasarkan tanggal masuk
          combinedData.sort((a, b) => new Date(b.masuk.Datetime).getTime() - new Date(a.masuk.Datetime).getTime());

          // Inisialisasi data tabel
          totalData = combinedData.length;
          filteredData = combinedData;
          
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
          });

          // Search Functionality
          const searchInput = CihuyId("searchInput");
          const searchButton = CihuyId("searchButton");

          searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
              const searchData = combinedData.filter((entry) => {
                const namaLowerCase = entry.masuk.biodata.nama.toLowerCase();
                return namaLowerCase.includes(searchTerm);
              });

              filteredData = searchData;

              totalData = filteredData.length;
              halamannow = 1;
              displayData(halamannow);
              updatePagination();
            } else {
              // If the search term is empty, display the original data
              filteredData = combinedData;
              totalData = combinedData.length;
              halamannow = 1;
              displayData(halamannow);
              updatePagination();
            }
          });
        })
        .catch(error => {
          console.log('error', error);
        });
    });

  // Fungsi Untuk Menampilkan Data
  function displayData(page) {
    const mulaiindex = (page - 1) * itemperpage;
    const akhirindex = mulaiindex + itemperpage;
    const rowsToShow = filteredData.slice(mulaiindex, akhirindex);

    let tableData = "";

    // Iterasi melalui rowsToShow dan membangun baris tabel
    rowsToShow.forEach((combinedEntry) => {
      const masukEntry = combinedEntry.masuk;
      const pulangEntry = combinedEntry.pulang;

      // Ekstrak data yang relevan
      const nama = masukEntry.biodata.nama;
      const lampiran = masukEntry.lampiran;
      const ketMasuk = masukEntry?.ket;
      const ketPulang = pulangEntry?.ket;
      const date = new Date(masukEntry.Datetime).toLocaleDateString('id-ID', {
        day : 'numeric',
        month : 'long',
        year : 'numeric'
      });
      const jamMasuk = new Date(masukEntry.Datetime).toLocaleTimeString();
      const jamPulang = pulangEntry ? new Date(pulangEntry.datetime).toLocaleTimeString() : '';
      const Durasi = pulangEntry ? pulangEntry.durasi : '0 Jam 0 Menit 0 Detik';
      const persentaseStatus = pulangEntry ? parseFloat(pulangEntry.persentase) : 0;
      const Persentase = pulangEntry ? pulangEntry.persentase : '0%';
      const lampiranContent = lampiran ? lampiran : '<p>Tidak Ada Catatan</p>';

      // Pengkondisian Badge Keterangan
      let ketBadgeMasuk = getBadgeMarkup(ketMasuk);
      let ketBadgePulang = getBadgeMarkup(ketPulang);

      let statusKerja = getStatusBadgeMarkup(persentaseStatus);

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

    document.getElementById("tablebody").innerHTML = tableData;
  }

  // Fungsi Untuk Update Pagination
  function updatePagination() {
    halamansaatini.textContent = `Halaman ${halamannow}`;
  }
});