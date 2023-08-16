// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

const requestOptions = {
	method: "GET",
	headers: header
};

async function fetchData() {
	const response = await fetch('https://hris_backend.ulbi.ac.id/presensi/datakaryawan', requestOptions);
	const data = await response.json();

	const tableBody = document.getElementById('tablebody');
	data.data.forEach(item => {
		const row = tableBody.insertRow();
		const namaCell = row.insertCell(0);
		const phoneCell = row.insertCell(1);
		const jabatanCell = row.insertCell(2);

		namaCell.innerHTML = item.nama;
		phoneCell.innerHTML = item.phone_number;
		jabatanCell.innerHTML = item.jabatan;
	});
}

fetchData();

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