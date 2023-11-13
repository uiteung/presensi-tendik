// Fungsi untuk menghitung rata-rata durasi dan persentase durasi
export function calculateAverages(data) {
	const totalDuration = data.reduce((total, pulangEntry) => {
	  if (pulangEntry.durasi) {
		const durationParts = pulangEntry.durasi.split(" ");
		const hours = parseInt(durationParts[0]) || 0;
		const minutes = parseInt(durationParts[2]) || 0;
		const seconds = parseInt(durationParts[4]) || 0;
		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		return total + totalSeconds;
	  } else {
		return total;
	  }
	}, 0);
	const totalPercentage = data.reduce((total, pulangEntry) => {
	  if (pulangEntry.durasi) {
		const percentage = parseFloat(pulangEntry.durasi.replace("%", ""));
		return total + percentage;
	  } else {
		return total;
	  }
	}, 0);
	const averageDuration = totalDuration / data.length;
	const averagePercentage = totalPercentage / data.length;
  
	return { averageDuration, averagePercentage };
}