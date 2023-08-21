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
  const doc = new jsPDF();

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
  const itemperpage = 10;
  let halamannow = 1;

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

  fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi", requestOptions)
    .then((result) => {
      return result.json();
    })
    .then((response) => {
      console.log(token);
      if (response && response.data && response.data.length > 0) {
        let combinedData = {}; // Combined data of masuk and pulang records

        response.data.forEach((entry) => {
          const biodata = entry.biodata;
          const checkin = entry.checkin;
          const datetime = entry.Datetime;

          // Parsing the datetime string to a valid Date object
          const parsedDate = new Date(datetime);

          if (!isNaN(parsedDate)) {
            const formattedDate = parsedDate.toISOString().split('T')[0];

            if (!combinedData[biodata.nama]) {
              combinedData[biodata.nama] = {};
            }

            if (!combinedData[biodata.nama][formattedDate]) {
              combinedData[biodata.nama][formattedDate] = {
                masuk: null,
                pulang: null,
                ket: entry.ket, // Include the ket property
                lampiran: entry.lampiran // Include the lampiran property
              };
            }

            if (checkin === "masuk") {
              combinedData[biodata.nama][formattedDate].masuk = parsedDate;
            } else if (checkin === "pulang") {
              combinedData[biodata.nama][formattedDate].pulang = parsedDate;
            }
          } else {
            console.log("Invalid datetime:", datetime);
          }
        });

        let tableData = "";
        for (const nama in combinedData) {
          for (const date in combinedData[nama]) {
            const { masuk, pulang, ket, lampiran } = combinedData[nama][date];
            const masukTime = masuk ? masuk.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Masuk";
            const pulangTime = pulang ? pulang.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Pulang";
            const masukStatus = masuk ? "Masuk" : "";
            const pulangStatus = pulang ? "Pulang" : "";
            const biodata = response.data.find(entry => entry.biodata.nama === nama).biodata;

            tableData += `
              <tr>
                  <td>
                      <div class="d-flex align-items-center">
                          <div class="ms-3">
                              <p class="fw-bold mb-1">${nama}</p>
                              <p class="text-muted mb-0">${biodata.phone_number}</p>
                          </div>
                      </div>
                  </td>
                  <td>
                      <p class="fw-normal mb-1">${biodata.jabatan}</p>
                  </td>
                  <td>
                      <p class="fw-normal mb-1"><b>${masukStatus}</b> ${masukTime}</p>
                      <p class="fw-normal mb-1"><b>${pulangStatus}</b> ${pulangTime}</p>
                  </td>
                  <td style="text-align: center; vertical-align: middle">
                      <p class="fw-normal mb-1">${date}</p>
                  </td>
                  <td style="text-align: center; vertical-align: middle">
                      <!-- Whatever you want to display -->
                  </td>
                  <td style="text-align: center; vertical-align: middle">
                      ${ket}
                  </td>
                  <td style="text-align: center; vertical-align: middle">
                      <!-- Whatever you want to display -->
                  </td>
                  <td style="text-align: center; vertical-align: middle">
                      ${lampiran}
                  </td>
              </tr>`;
          }
        }

        document.getElementById("tablebody").innerHTML = tableData;
        displayData(halamannow);
        updatePagination();
      } else {
        console.log('Sabar gblg');
      }
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