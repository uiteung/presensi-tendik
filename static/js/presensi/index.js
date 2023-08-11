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
            // Di dalam loop tempat Anda menghasilkan data tabel
            for (const nama in combinedData) {
                for (const date in combinedData[nama]) {
                    const { masuk, pulang } = combinedData[nama][date];
                    const masukTime = masuk ? masuk.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak absen masuk";
                    const pulangTime = pulang ? pulang.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", timeStyle: "medium" }) : "Tidak absen pulang";
                    const masukStatus = masuk ? "Masuk" : "";
                    const pulangStatus = pulang ? "Pulang" : "";
                    const biodata = response.data.find(entry => entry.biodata.nama === nama).biodata;

                    // Sisanya kode pembuatan data tabel
                    tableData += `
                  <tr>
                      <td>
                          <div class="d-flex align-items-center">
                              <div class="ms-3">
                                  <p class="fw-bold mb-1">${nama}</p>
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
    const totalDetikHadir = 8 * 60 * 60;

    const persentase = (durasiDetik / totalDetikHadir) * 100;

    return persentase.toFixed(2) + "%";
}
