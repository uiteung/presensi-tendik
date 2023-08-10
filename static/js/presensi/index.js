fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi")
    .then((result) => {
        return result.json();
    })
    .then((response) => {
        if (response && response.data && response.data.length > 0) {
            let tableData = "";

            response.data.forEach((entry) => {
                // Akses objek biodata di dalam objek entry
                const biodata = entry.biodata;

                // Mendapatkan data checkin dan datetime
                const checkin = entry.checkin;
                const datetime = entry.datetime;

                // Mengubah string datetime menjadi objek Date
                const dateObject = new Date(datetime);
                
                // Mendapatkan tanggal dalam format yyyy-mm-dd
                const formattedDate = dateObject.toISOString().split('T')[0];
                // Mendapatkan format jam, menit, dan detik (hh:mm:ss)
                const formattedTime = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}:${String(dateObject.getSeconds()).padStart(2, '0')}`;

                tableData += `
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="ms-3">
                        <p class="fw-bold mb-1">${biodata.nama}</p>
                        <p class="text-muted mb-0">${biodata.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fw-normal mb-1">${biodata.jabatan}</p>
                  </td>
                  <td>
                    <p class="fw-normal mb-1"><b>${checkin === "masuk" ? "Masuk" : "Pulang"}</b>, ${formattedTime}</p>
                  </td>
                  <td>
                      <p class="fw-normal mb-1">${formattedDate}</p>
                  </td>
                  <td>
                      8 Jam 30 menit 4 detik
                  </td>
                  <td>
                      102%
                  </td>
                </tr>`;
            });

            // Tampilkan data pegawai ke dalam tabel
            document.getElementById("tablebody").innerHTML = tableData;
        } else {
            console.log("Data tidak tersedia atau struktur data tidak sesuai.");
        }
    })
    .catch(error => {
        console.log('error', error);
    });