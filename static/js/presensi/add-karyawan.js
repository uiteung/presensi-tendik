// Untuk Autentifikasi Login User Tertentu
import { token } from "../controller/cookies.js";
import { UrlPostDataKaryawan } from "../controller/template.js";

// Untuk header
var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Function to add employee data
function addEmployee(postData) {
    fetch(UrlPostDataKaryawan, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Display success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Data Karyawan Berhasil Ditambahkan!',
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'seluruh-karyawan.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data Karyawan Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding employee data:", error);
    });
  }
  
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const employeeName = document.querySelector('#employeeNameInput').value;
  const employeePosition = document.querySelector('#employeePositionInput').value;
  const employeeWhatsapp = document.querySelector('#employeeWhatsappInput').value;
  
  // Check if any of the fields is empty
  if (!employeeName || !employeePosition || !employeeWhatsapp) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    nama: employeeName,
    jabatan: employeePosition,
    phone_number: employeeWhatsapp
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Karyawan',
    text: 'Anda Yakin Menambah Data Karyawan?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      addEmployee(postData);
    }
  });
});