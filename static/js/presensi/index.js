fetch("https://hris_backend.ulbi.ac.id/presensi/datapresensi")
    .then((result) => {
        return result.json();
    })
    .then((response) => {
        if (response && response.data && response.data.length > 0) {
            let tableData = "";

            const masukData = {}; // Menyimpan data jam masuk berdasarkan tanggal
            const pulangData = {}; // Menyimpan data jam pulang berdasarkan tanggal

            response.data.forEach((entry) => {
                const biodata = entry.biodata;
                const checkin = entry.checkin;
                const datetime = entry.datetime;
                const dateObject = new Date(datetime);
                const formattedDate = dateObject.toISOString().split('T')[0];
                const formattedTime = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}:${String(dateObject.getSeconds()).padStart(2, '0')}`;

                if (checkin === "masuk") {
                    masukData[formattedDate] = formattedTime;
                } else if (checkin === "pulang") {
                    pulangData[formattedDate] = formattedTime;
                }

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
                        ${
                            checkin === "pulang" && masukData[formattedDate]
                            ? calculateDuration(masukData[formattedDate], formattedTime)
                            : "0 Jam 0 Menit 0 Detik"
                        }
                    </td>
                    <td>
                        ${
                            checkin === "pulang" && masukData[formattedDate]
                            ? calculatePercentage(masukData[formattedDate], formattedTime)
                            : "0%"
                        }
                    </td>
                </tr>`;
            });

            document.getElementById("tablebody").innerHTML = tableData;
        } else {
            console.log("Data tidak tersedia atau struktur data tidak sesuai.");
        }
    })
    .catch(error => {
        console.log('error', error);
    });

function calculateDuration(masukTime, pulangTime) {
    const masuk = new Date(`2000-01-01T${masukTime}`);
    const pulang = new Date(`2000-01-01T${pulangTime}`);
    const durasi = pulang - masuk;

    const durasiJam = Math.floor(durasi / (1000 * 60 * 60));
    const durasiMenit = Math.floor((durasi % (1000 * 60 * 60)) / (1000 * 60));
    const durasiDetik = Math.floor((durasi % (1000 * 60)) / 1000);

    return `${durasiJam} Jam ${durasiMenit} Menit ${durasiDetik} Detik`;
}

function calculatePercentage(masukTime, pulangTime) {
  const masuk = new Date(`2000-01-01T${masukTime}`);
  const pulang = new Date(`2000-01-01T${pulangTime}`);
  const durasi = pulang - masuk;

  const durasiDetik = durasi / 1000;
  const totalDetikHadir = 8 * 60 * 60;

  const persentase = (durasiDetik / totalDetikHadir) * 100;

  return persentase.toFixed(2) + "%";
}