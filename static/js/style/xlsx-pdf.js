// Untuk membuat interaksi button export to excel
export function html_table_to_excel(type) {
    var data = document.getElementById('example');
    var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    XLSX.writeFile(file, 'Data Rekap Presensi.' + type);
  }
  const export_button = document.getElementById('exportExcelBtn');
  export_button.addEventListener('click', () => {
    html_table_to_excel('xlsx');
  })