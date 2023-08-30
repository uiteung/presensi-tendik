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
  const buttonsebelumnya = CihuyId("prevPageBtn");
  const buttonselanjutnya = CihuyId("nextPageBtn");
  const halamansaatini = CihuyId("currentPage");
  const itemperpage = 8;
  let halamannow = 1;

  // Ambil data masuk
  fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi", requestOptions)
  .then((result) => result.json())
  .then((masukData) => {
    // Ambil data pulang
    fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulang", requestOptions)
      .then((result) => result.json())
      .then((pulangData) => {
        // Gabungkan data berdasarkan nama dan tanggal yang sesuai
        const combinedData = [];
        masukData.data.forEach((masukEntry) => {
          const matchingPulangEntry = pulangData.data.find((pulangEntry) =>
            pulangEntry.biodata.nama === masukEntry.biodata.nama &&
            new Date(pulangEntry.datetime).toLocaleDateString() === new Date(masukEntry.Datetime).toLocaleDateString()
          );
          if (matchingPulangEntry) {
            combinedData.push({
              masuk: masukEntry,
              pulang: matchingPulangEntry,
            });
          }
        });

      // Sort the combinedData array by date
      combinedData.sort((a, b) => new Date(b.masuk.Datetime).getTime() - new Date(a.masuk.Datetime).getTime());

      // Initialize tableData
      let tableData = "";

      // Iterate through combinedData and build table rows
      combinedData.forEach((combinedEntry) => {
        const masukEntry = combinedEntry.masuk;
        const pulangEntry = combinedEntry.pulang;

        // Extract relevant data
        const nama = masukEntry.biodata.nama;
        const lampiran = masukEntry.lampiran;
        // const statusMasuk = masukEntry.checkin;
        // const statusPulang = pulangEntry.checkin;
        const ketMasuk = masukEntry.ket;
        const ketPulang = pulangEntry.ket;
        const date = new Date(masukEntry.Datetime).toLocaleDateString();
        const jamMasuk = new Date(masukEntry.Datetime).toLocaleTimeString();
        const jamPulang = new Date(pulangEntry.datetime).toLocaleTimeString();
        const Durasi = pulangEntry.durasi;
        const Persentase = pulangEntry.persentase;
        const lampiranContent = lampiran ? lampiran : '<p>Tidak ada Catatan</p>';

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
            ketBadgeMasuk = "";
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
            ketBadgePulang = "";
          }

          let statusKerja = '';
          if (Durasi >= '100%') {
            statusKerja = '<span class=badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Tuntas</span>'
          } else if (Durasi < '100%') {
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
  })
});