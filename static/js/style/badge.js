// Function to get badge markup based on the status
export function getBadgeMarkup(status) {
    switch (status) {
      case 'Lebih Cepat':
        return '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Lebih Cepat</span>';
      case 'Tepat Waktu':
        return '<span class="badge-blue" style="font-size: 10px; background-color: #0d6efd; color: white; padding: 5px 10px; border-radius: 5px;">Tepat Waktu</span>';
      case 'Terlambat':
        return '<span class="badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Terlambat</span>';
      case 'Sakit':
        return '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Sakit</span>';
      case 'izin':
        return '<span class="badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Izin</span>';
      default:
        return "<span>Belum Presensi</span>";
    }
}

// Function to get badge markup based on the status
export function getStatusBadgeMarkup(persentaseStatus) {
    if (persentaseStatus >= 100) {
      return '<span class="badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Tuntas</span>';
    } else if (persentaseStatus < 100) {
      return '<span class="badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Belum Tuntas</span>';
    } else {
      return '';
    }
}

// Function to get badge markup based on the status
export function getBadgeMarkupDetail(status) {
    switch (status) {
        case 'Lebih Cepat':
            return '<span class="badge-green" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Lebih Cepat</span>';
        case 'Tepat Waktu':
            return '<span class="badge-blue" style="font-size: 10px; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px;">Tepat Waktu</span>';
        case 'Terlambat':
            return '<span class="badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Terlambat</span>';
        case 'Sakit':
            return '<span class="badge-warning" style="font-size: 10px; background-color: #ffcc00; color: white; padding: 5px 10px; border-radius: 5px;">Sakit</span>';
        case 'izin':
            return '<span class="badge-warning" style="font-size: 10px; background-color: #ff8700; color: white; padding: 5px 10px; border-radius: 5px;">Izin</span>';
        default:
            return "<span>Belum Presensi</span>";
    }
}

// Function to get badge markup based on the status
export function getStatusBadgeMarkupDetail(persentaseStatus) {
    if (persentaseStatus >= 100) {
        return '<span class="badge-danger" style="font-size: 10px; background-color: #22bb33; color: white; padding: 5px 10px; border-radius: 5px;">Tuntas</span>';
    } else if (persentaseStatus < 100) {
        return '<span class="badge-danger" style="font-size: 10px; background-color: #bb2124; color: white; padding: 5px 10px; border-radius: 5px;">Belum Tuntas</span>';
    } else {
        return '';
    }
}