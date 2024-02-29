import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { UrlGetAllKaryawan, requestOptionsGet, UrlDeleteKaryawan } from "../controller/template.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 12;
	let halamannow = 1;

fetch(UrlGetAllKaryawan, requestOptionsGet)
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
				window.location.href = `perizinan.html?_id=${_id}`;
			});
		});

		// Menambahkan event listener untuk button "Perizinan"
		const editkaryawanButtons = document.querySelectorAll('.btn-info');
		editkaryawanButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const _id = event.target.getAttribute('data-employee-id');
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
			deleteData(_id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteData(_id) {
	const deleteUrl = UrlDeleteKaryawan + `/${_id}`;
	
	fetch(deleteUrl, )
	  .then((response) => response.json())
	  .then((data) => {
		console.log("Data deleted:", data);
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Karyawan Berhasil Dihapus.',
			icon: 'success'
		  }).then(() => {
			location.reload();
		  });
		})
	  	.catch((error) => {
			console.error("Error deleting data:", error);
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
	doc.text(title, 10, 10);
	doc.autoTable({ html: '#example' });
	doc.save(`${filename}.pdf`);
});

// Function for Pagination
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