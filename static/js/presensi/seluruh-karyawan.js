import { token } from "../controller/cookies.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 12;
	let halamannow = 1;

fetch("https://hris_backend.ulbi.ac.id/presensi/datakaryawan", requestOptions)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values) => {
			tableData += `
				<tr>
					<td hidden></td>
					<td>
						<p class="fw-normal mb-1">${values.nama}</p>
					</td>
					<td style="text-align: center; vertical-align: middle>
						<p">${values.phone_number}</p>
					</td>
					<td>
						<p class="fw-normal mb-1">${values.jabatan}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<button type="button" class="btn btn-info" data-employee-id="${values._id}">Edit</button>	
						<button type="button" class="btn btn-warning" data-employee-id="${values._id}">Perizinan</button>
						<button type="button" class="btn btn-danger" data-employee-id="${values._id}">Hapus</button>
					</td>
				</tr>`;
		});
		document.getElementById("tablebody").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Perizinan"
		const perizinanButtons = document.querySelectorAll('.btn-warning');
		perizinanButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const _id = event.target.getAttribute('data-employee-id');
				// Mengarahkan ke halaman perizinan.html dengan mengirimkan parameter _id karyawan
				window.location.href = `perizinan.html?_id=${_id}`;
			});
		});

		// Menambahkan event listener untuk button "Perizinan"
		const editkaryawanButtons = document.querySelectorAll('.btn-info');
		editkaryawanButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const _id = event.target.getAttribute('data-employee-id');
				// Mengarahkan ke halaman perizinan.html dengan mengirimkan parameter _id karyawan
				window.location.href = `edit-karyawan.html?_id=${_id}`;
			});
		});
		
	})
	.catch(error => {
		console.log('error', error);
	});

// Function Delete Data Izin dan Sakit
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const _id = target.getAttribute("data-employee-id");
	  if (_id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data Karyawan?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// User confirmed, call the function to handle deletion
			deleteData(_id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteData(_id) {
	const deleteUrl = `https://hris_backend.ulbi.ac.id/presensi/datakaryawan/deletedata/${_id}`;
	
	fetch(deleteUrl, {
	  method: "DELETE",
	  headers: header
	})
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Karyawan Berhasil Dihapus.',
			icon: 'success'
		  }).then(() => {
			// Reload the page after successful deletion
			location.reload();
		  });
		})
	  	.catch((error) => {
			console.error("Error deleting data:", error);
			
			// Display error SweetAlert
			Swal.fire(
			'Error!',
			'Data Karyawan Gagal Dihapus',
			'error'
			);
		});
  }

// Untuk membuat interaksi button export to excel dan pdf
const title = document.getElementById('titleTextBox').value;
const filename = document.getElementById('filenameTextBox').value;

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
	doc.text(title, 10, 10);
	doc.autoTable({ html: '#example' });

	doc.save(`${filename}.pdf`);
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