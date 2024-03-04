import { token } from "./cookies.js";

// Create Header
var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Request Option
export let requestOptionsGet = { method: "GET", headers: header };
export let requestOptionsDelete = { method: "DELETE", headers: header };
export let requestOptionsPost = { method: "POST", headers: header };
export let requestOptionsUpdate = { method: "PATCH", headers: header };

// Endpoint Get All
export let UrlGetAllMasukHarian = "https://hris_backend.ulbi.ac.id/presensi/datapresensi/masukharian";
export let UrlGetAllPulangHarian = "https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulangharian";
export let UrlGetAllPresensi = "https://hris_backend.ulbi.ac.id/presensi/datapresensi";
export let UrlGetAllPresensiPulang = "https://hris_backend.ulbi.ac.id/presensi/datapresensi/pulang";
export let UrlGetAllCommitsRekapHarian = "https://hris_backend.ulbi.ac.id/api/v2/commits/rekapharian";
export let UrlGetAllPerforma = "https://hris_backend.ulbi.ac.id/api/v2/commits/performance";
export let UrlGetAllKaryawan = "https://hris_backend.ulbi.ac.id/presensi/datakaryawan";
export let UrlGetAllLayanan = "https://hris_backend.ulbi.ac.id/api/v2/ux/uxlaporan";

// Endpoint Get By Id
export let UrlGetKaryawanById = "https://hris_backend.ulbi.ac.id/presensi/datapresensi/getkaryawan";

// Endpoint Post
export let UrlPostDataKaryawan = "https://hris_backend.ulbi.ac.id/presensi/datakaryawan/postdata";

// Endpoint Update
export let UrlPutDataKaryawan = "https://hris_backend.ulbi.ac.id/presensi/datakaryawan/updatedata/";

// Endpoint Delete
export let UrlDeleteKaryawan = "https://hris_backend.ulbi.ac.id/presensi/datakaryawan/deletedata";
export let UrlDeletePresensi = "https://hris_backend.ulbi.ac.id/presensi/datapresensi/deletedata";