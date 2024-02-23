// Import function & library yang dibutuhkan
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady } from "https://c-craftjs.github.io/table/table.js";
import { getBadgeMarkup, getBadgeCommit, getBadgePulang } from "../style/badge.js";
import { UrlGetAllCommitsRekapHarian, UrlGetAllPerforma } from "../controller/template.js";

// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: header
};

function updateRekap() {
  fetch(UrlGetAllPerforma, {
    method: 'POST',
    headers: header,
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Display success SweetAlert

      Swal.fire({
        icon : 'success',
        title: 'Data Rekap Hari ini Berhasil Diupdate!',
        backdrop: `
          rgba(0,0,123,0.4)
        `
      })
      .then(() => {
        // Refresh the page after successful addition
        window.location.href = 'harian-commit.html';
      });
    } else {
      // Display error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Data rekap Gagal Diupdate!',
      });
    }
  })
  .catch(error => {
    console.error("Error while updating data:", error);
  });
}

const currentUTC7Time = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
const currentTime = new Date(currentUTC7Time);
const currentHour = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();

console.log(`Current Time: ${currentHour}:${currentMinutes}`);

if (currentHour === 18 && currentMinutes === 0) {
  // Perform your task when it's 16:00 (4:00 PM)
  updateRekap();
}


setInterval(updateRekap, 300000)
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#UpdateButton');
submitButton.addEventListener('click', () => {
// Check if any of the fields is emp


// Display SweetAlert for confirmation
Swal.fire({
  title: 'Update Rekap Harian',
  text: 'Anda Yakin Ingin Mengupdate data?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes',
  cancelButtonText: 'No'
}).then((result) => {
  if (result.isConfirmed) {
    // Call function to add employee data
    updateRekap();
  }
});
});


// Untuk Get All data Presensi
CihuyDomReady(() => {
//   const tablebody = CihuyId("tablebody");
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage =6;
  let halamannow = 1;
  let filteredData = []; // To store the filtered data for search
  let totalData = 0;

  // Ambil data masuk
  fetch(UrlGetAllCommitsRekapHarian, requestOptions)
    .then((result) => result.json())
    .then((rekapharian) => {
        let rkp = rekapharian.data
          // Sortir array combinedData berdasarkan tanggal masuk
          rkp.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    const mulaiindex = (page - 1) * itemperpage;
    const akhirindex = mulaiindex + itemperpage;
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
      const date = new Date(combinedEntry.date).toLocaleDateString('id-ID', {
        day : 'numeric',
        month : 'long',
        year : 'numeric'
      });
      const jamMasuk = combinedEntry.presensi.presensiMasuk ? new Date(combinedEntry.presensi.presensiMasuk).toLocaleTimeString(): '' ;
      let jamPulang = combinedEntry.presensi.presensiPulang ? new Date(combinedEntry.presensi.presensiPulang).toLocaleTimeString(): '' ;

      // Pengkondisian Badge Keterangan
      let ketBadgeMasuk = getBadgeMarkup(ketMasuk);
      let ketBadgePulang = getBadgePulang(ketPulang);
      let BadgeCommit = getBadgeCommit(combinedEntry.total);

    //   let statusKerja = getStatusBadgeMarkup(persentaseStatus);

      tableData += `
          <tr>
              <td hidden></td>
              <td style="text-align: center; vertical-align: middle">
                  <p class="fw-bold mb-1">${nama}</p>
                  <p class="text-muted mb-0">${email}</p>d
              </td>
              <td style="text-align: center; vertical-align: middle">
                  <p class="fw-normal mb-1">${date}</p>
              </td>
              <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${jamMasuk}</p>
                <p class="fw-normal mb-1"><b>${ketBadgeMasuk}</b></p>
              </td>
              <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${jamPulang}</p>
                <p class="fw-normal mb-1"><b>${ketBadgePulang}</b></p>
              </td>
              <td style="text-align: center; vertical-align: middle">
                  <p class="fw-normal mb-1">${jmlCommit}</p>
              </td>
              <td style="text-align: center; vertical-align: middle">
                <p class="fw-normal mb-1">${BadgeCommit}</p>
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