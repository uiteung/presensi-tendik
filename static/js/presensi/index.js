fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi")
    .then((result) => {
        return result.json();
    })
    .then((response) => {
        if (response && response.data && response.data.length > 0) {
            let combinedData = {}; // Combined data of masuk and pulang records

            response.data.forEach((entry) => {
                const biodata = entry.biodata;
                const checkin = entry.checkin;
                const datetime = entry.datetime;
                const formattedDate = new Date(datetime).toISOString().split('T')[0];

                if (!combinedData[biodata.nama]) {
                    combinedData[biodata.nama] = {};
                }

                if (!combinedData[biodata.nama][formattedDate]) {
                    combinedData[biodata.nama][formattedDate] = {
                        masuk: null,
                        pulang: null,
                    };
                }

                if (checkin === "masuk") {
                    combinedData[biodata.nama][formattedDate].masuk = new Date(datetime);
                } else if (checkin === "pulang") {
                    combinedData[biodata.nama][formattedDate].pulang = new Date(datetime);
                }
            });

            let tableData = "";
              for (const nama in combinedData) {
                  for (const date in combinedData[nama]) {
                      const { masuk, pulang } = combinedData[nama][date];
                      const masukTime = masuk ? masuk.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Masuk";
                      const pulangTime = pulang ? pulang.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak Absen Pulang";
                      const masukStatus = masuk ? "Masuk" : "";
                      const pulangStatus = pulang ? "Pulang" : "";
                      const biodata = response.data.find(entry => entry.biodata.nama === nama).biodata;

                      // Tentukan keterangan badge "Masuk Kerja" jika sudah pulang
                      const keterangan = pulangStatus
                      ? '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Masuk Kerja</span>' 
                      : '<a class="btn btn-primary" href="#">Action</a>';

                      // Tentukan apakah tombol "Uploud" akan muncul atau tidak
                      const uploudButton = pulangStatus 
                      ? '<span style="font-size: 13px;">Tidak Ada Catatan</span>' 
                      : '<a class="btn btn-info" style="color: white" href="#">Uploud</a>';

                      // Sisanya kode pembuatan data tabel
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
                          <td>
                              <p class="fw-normal mb-1">${date}</p>
                          </td>
                          <td>
                              ${
                                  pulang && masuk
                                  ? calculateDuration(masuk, pulang)
                                  : "0 Jam 0 Menit 0 Detik"
                              }
                          </td>
                          <td>
                              ${
                                  pulang && masuk
                                  ? calculatePercentage(masuk, pulang)
                                  : "0%"
                              }
                          </td>
                          <td>
                              ${keterangan}
                          </td>
                          <td>
                             ${uploudButton}
                          </td>
                      </tr>`;
                  }
              }

            document.getElementById("tablebody").innerHTML = tableData;
        } else {
            console.log("Data tidak tersedia atau struktur data tidak sesuai.");
        }
    })
    .catch(error => {
        console.log('error', error);
    });

function calculateDuration(masukTime, pulangTime) {
    const durasi = pulangTime - masukTime;

    const durasiJam = Math.floor(durasi / (1000 * 60 * 60));
    const durasiMenit = Math.floor((durasi % (1000 * 60 * 60)) / (1000 * 60));
    const durasiDetik = Math.floor((durasi % (1000 * 60)) / 1000);

    return `${durasiJam} Jam ${durasiMenit} Menit ${durasiDetik} Detik`;
}

function calculatePercentage(masukTime, pulangTime) {
    const durasi = pulangTime - masukTime;

    const durasiDetik = durasi / 1000;
    const totalDetikHadir = 8.5 * 60 * 60;

    const persentase = (durasiDetik / totalDetikHadir) * 100;

    return persentase.toFixed(2) + "%";
}

function html_table_to_excel(type)
		{
			var data = document.getElementById('example');

			var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

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

    // const startDateInput = document.getElementById('startDate');
    // const endDateInput = document.getElementById('endDate');
    
    // const applyFilterBtn = document.getElementById('applyFilterBtn');
    
    // applyFilterBtn.addEventListener('click', applyDateFilter);
    
    // function applyDateFilter() {
    //     const startDate = new Date(startDateInput.value);
    //     const endDate = new Date(endDateInput.value);
    
    //     filterDataByDate(startDate, endDate);
    // }