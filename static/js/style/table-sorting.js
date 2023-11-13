// Fungsi umum untuk penyortiran tabel
function sortTable(table, columnIndex, ascending) {
	const tableBody = table.querySelector('tbody');
	const rows = Array.from(tableBody.querySelectorAll('tr'));

	rows.sort((a, b) => {
		const aValue = a.cells[columnIndex].textContent;
		const bValue = b.cells[columnIndex].textContent;
		return aValue.localeCompare(bValue, undefined, { numeric: true });
	});

	if (!ascending) {
		rows.reverse();
	}

	tableBody.innerHTML = '';

	rows.forEach(row => tableBody.appendChild(row));
}

// Pasang pendengar acara untuk tombol penyortiran di setiap kolom
const table = document.getElementById('example');
const headerCells = table.querySelectorAll('th');

headerCells.forEach((cell, index) => {
	// Tambahkan tombol arah penyortiran pada setiap header kolom
	cell.innerHTML += '<span class="sort-icon">&#8595;</span>';

	let ascending = true;

	cell.addEventListener('click', () => {
		// Toggle arah penyortiran saat tombol di klik
		ascending = !ascending;

		// Hapus tombol arah penyortiran pada semua kolom
		headerCells.forEach(headerCell => {
			headerCell.querySelector('.sort-icon').textContent = '';
		});

		// Tambahkan tombol arah penyortiran pada kolom yang di-klik
		cell.querySelector('.sort-icon').textContent = ascending ? '↓' : '↑';

		// Panggil fungsi penyortiran dengan arah yang sesuai
		sortTable(table, index, ascending);
	});
});

// Untuk Sorting Data berdasarkan tanggal (start date to end date)
// Fungsi untuk memeriksa apakah suatu tanggal berada dalam rentang tertentu
function isDateInRange(date, startDate, endDate) {
	return date >= startDate && date <= endDate;
}

// Fungsi untuk menerapkan filter berdasarkan rentang tanggal
function applyDateFilter(table, startDate, endDate) {
	const tableBody = table.querySelector('tbody');
	const rows = Array.from(tableBody.querySelectorAll('tr'));

	rows.forEach((row) => {
		const dateCell = row.cells[3]; // Kolom ke-3 (Tangal)
		const dateValue = new Date(dateCell.textContent);
		row.style.display = isDateInRange(dateValue, startDate, endDate) ? '' : 'none';
	});
}

// Pasang pendengar acara untuk tombol filter berdasarkan tanggal
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const filterButton = document.getElementById('filterButton');

filterButton.addEventListener('click', () => {
	const startDateValue = new Date(startDateInput.value);
	const endDateValue = new Date(endDateInput.value);

	if (!isNaN(startDateValue) && !isNaN(endDateValue)) {
		applyDateFilter(table, startDateValue, endDateValue);
	}
});

// Membuat fitur search
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const tableBody = document.getElementById("tablebody").getElementsByTagName("tr");

    searchInput.addEventListener("input", function () {
      const searchText = searchInput.value.toLowerCase();

      for (const row of tableBody) {
        const cells = row.getElementsByTagName("td");
        let rowMatchesSearch = false;

        for (const cell of cells) {
          if (cell.textContent.toLowerCase().includes(searchText)) {
            rowMatchesSearch = true;
            break;
          }
        }

        row.style.display = rowMatchesSearch ? "" : "none";
      }
    });
  });
