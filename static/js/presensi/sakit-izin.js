import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { UrlGetAllPresensi, UrlDeletePresensi, requestOptionsDelete, requestOptionsGet } from "../controller/template.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtnSakit");
	const buttonselanjutnya = CihuyId("nextPageBtnSakit");
	const halamansaatini = CihuyId("currentPageSakit");
	const itemperpage = 8;
	let halamannow = 1;

	fetch(UrlGetAllPresensi, requestOptionsGet)
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			// Sorting descending data
			data.data.sort((a, b) => new Date(b.Datetime) - new Date(a.Datetime));

			// Untuk Filter data yang sakit dan izin saja
			const filteredData = data.data.filter(entry => entry.ket === 'Sakit' || entry.ket === 'Izin');

			let tableData = "";
			filteredData.map((entry) => {
				const nama = entry.biodata.nama;
				// const checkin = entry.checkin;
				const lampiran = entry.lampiran;
				const ket = entry.ket;
				const phone_number = entry.biodata.phone_number;
				const dateObj = new Date(entry.tgl);
				const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

				// Pengkondisian Badge Keterangan
				let ketBadge = '';
				if (ket === 'Izin') {
					ketBadge = '<span class=badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Izin</span>';
				} else if (ket === 'Sakit') {
					ketBadge = '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Sakit</span>';
				} else {
					ketBadge = "";
				}

				const lampiranContent = lampiran ? lampiran : '<p>Tidak ada Catatan</p>';

				tableData += `
				<tr>
				<td hidden></td>
				<td>
					<div class="d-flex align-items-center">
							<div class="ms-3">
								<p class="fw-bold mb-1">${nama}</p>
								<p class="text-muted mb-0">${phone_number}</p>
							</div>
						</div>
					</td>
					<td>
						<p class="fw-normal mb-1">${entry.biodata.jabatan}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${formattedDate}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${ketBadge}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<a href="${lampiranContent}" class="fw-normal mb-1">Buka Link Dokumen</a>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<button class="btn btn-info">Edit</button>
						<button class="btn btn-danger" data-entry-id="${entry._id}">Hapus</button>
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

	// Function untuk Pagination
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

// Function Delete Data Izin dan Sakit
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const _id = target.getAttribute("data-entry-id");
	  if (_id) {
		Swal.fire({
		  title: 'Hapus Data Perizinan?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			deleteData(_id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteData(_id) {
	const deleteUrl = UrlDeletePresensi + `/${_id}`;
	
	fetch(deleteUrl, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		console.log("Data deleted:", data);
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Perizinan Berhasil Dihapus.',
			icon: 'success',
			showConfirmButton: false,
			timer: 1500
		  }).then(() => {
			location.reload();
		  });
		})
	  	.catch((error) => {
			console.error("Error deleting data:", error);
			Swal.fire(
			'Error!',
			'Data Perizinan Gagal Dihapus',
			'error'
			);
		});
  }