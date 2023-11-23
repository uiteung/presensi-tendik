// Untuk membuat interaksi button export to excel
export function html_table_to_excel(type) {
  var data = document.getElementById('example');
  var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
  var base64data = XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
  saveAs(new Blob([s2ab(atob(base64data))], { type: "application/octet-stream" }), 'Data Rekap Presensi.' + type);
}

const export_button = document.getElementById('exportExcelBtn');
export_button.addEventListener('click', () => {
  html_table_to_excel('xlsx');
});

const exportPdfButton = document.getElementById('exportPdfBtn');

exportPdfButton.addEventListener('click', () => {
  // Get values from text boxes
  const title = document.getElementById('titleTextBox').value;
  const filename = document.getElementById('filenameTextBox').value;

  const doc = new jsPDF();

  // Specify theme for the table header
  const tableOptions = {
    html: '#example',
    theme: 'grid',
    styles: { 
      fontSize: 5,
      overflow: 'linebreak'
    },
  };

  // You might need to adjust these values for styling and layout
  doc.text(title, 10, 10);
  doc.autoTable(tableOptions);
  doc.save(`${filename}.pdf`);
});

// Helper function to convert data to array buffer
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}