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

// Untuk membuat interaksi button export to excel
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

// Function to export data to PDF
function html_table_to_pdf() {
  const doc = new jsPDF();
  doc.autoTable({ html: '#example' });
  doc.save('Data_Rekap_Presensi.pdf');
}
const exportPdfBtn = document.getElementById('exportPdfBtn');
exportPdfBtn.addEventListener('click', () => {
  html_table_to_pdf();
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
      let tableData = "";

      // Iterasi melalui combinedData dan membangun baris tabel
      combinedData.forEach((combinedEntry) => {
        const masukEntry = combinedEntry.masuk;
        const pulangEntry = combinedEntry.pulang;

        // Ekstrak data yang relevan
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

          // Pengkondisian Badge Keterangan
          let ketBadgeMasuk = '';
          if (ketMasuk === 'Lebih Cepat') {
            ketBadgeMasuk = '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Lebih Cepat</span>';
          } else if (ketMasuk === 'Tepat Waktu') {
            ketBadgeMasuk = '<span class="badge-blue" style="font-size: 10px; background-color: #0d6efd; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Tepat Waktu</span>';
          } else if (ketMasuk === 'Terlambat') {
            ketBadgeMasuk = '<span class=badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Terlambat</span>';
          } else if (ketMasuk === 'Sakit') {
            ketBadgeMasuk = '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Sakit</span>';
          } else if (ketMasuk === 'izin') {
            ketBadgeMasuk = '<span class=badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Izin</span>'
          } else {
            ketBadgeMasuk = "<span>Belum Presensi Masuk</span>";
          }

          // Pengkondisian Badge Keterangan
          let ketBadgePulang = '';
          if (ketPulang === 'Lebih Cepat') {
            ketBadgePulang = '<span class="badge-green" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Lebih Cepat</span>';
          } else if (ketPulang === 'Tepat Waktu') {
            ketBadgePulang = '<span class="badge-blue" style="font-size: 10px; background-color: #0d6efd; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Tepat Waktu</span>';
          } else if (ketPulang === 'Lebih Lama') {
            ketBadgePulang = '<span class=badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Pulang Lebih Lama</span>';
          } else {
            ketBadgePulang = "<span>Belum Presensi Pulang</span>";
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
      document.getElementById("tablebody").innerHTML = tableData;

      // Untuk Memunculkan Pagination Halamannya
      displayData(halamannow);
			updatePagination();

      // Untuk Hitung Rata-rata Durasi dan Persentase
      const averages = calculateAverages(combinedData);

      // Update Element HTML dengan Rata-Rata Durasi dan Persentase Durasi
      document.getElementById("averageDuration").textContent = `Rata-Rata Durasi : ${averages.averageDuration.toFixed(2)} detik`;
      document.getElementById("averagePercentage").textContent = `Rata-Rata Persentase Durasi : ${averages.averagePercentage.toFixed(2)} %`;
    })
    .catch(error => {
      console.log('error', error);
    });

  // Fungsi Untuk Menampilkan Data
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

  // Fungsi Untuk Update Pagination
	function updatePagination() {
		halamansaatini.textContent = `Halaman ${halamannow}`;
	}

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