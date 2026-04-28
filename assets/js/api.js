/**
 * Konfigurasi API Team Computer - ASP .NET
 * Base URL: https://api-teamcom.runasp.net/api
 */

// Ganti base URL ke API eksternal langsung
const API_BASE = 'https://teamcom-api.somee.com/api/';

function apiUrl(path) {
    // Pastikan tidak ada double slash
    return API_BASE.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

const API_ENDPOINTS = {
    getAngkatan: () => apiUrl('DaftarAnggota/get-angkatan'),
    daftarAnggota: (angkatan, page, pageSize) =>
        apiUrl(`DaftarAnggota?angkatan=${encodeURIComponent(angkatan)}&page=${page}&pageSize=${pageSize || 20}`),
    getTahunPrestasi: () => apiUrl('PrestasiTimkom/get-tahun'),
    prestasiTimkom: (tahun) =>
        apiUrl(tahun ? `PrestasiTimkom?tahun=${encodeURIComponent(tahun)}` : 'PrestasiTimkom'),
};

/**
 * Normalisasi data anggota dari API (camelCase/PascalCase) → snake_case UI
 */
function normalizeAnggota(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map(m => ({
        id_anggota: m.id != null ? String(m.id) : m.id_anggota,
        nama: m.nama,
        angkatan: m.angkatan != null ? String(m.angkatan) : m.angkatan,
        jurusan: m.jurusan,
        tanggal_lahir: m.tanggalLahir || m.tanggal_lahir,
        alamat: m.alamat,
        email: m.email,
        foto_url: m.fotoUrl || m.foto_url,
        jabatan: m.jabatan,
        // Tambahkan mapping untuk sosial media
        instagram: m.instagram, 
        tiktok: m.tiktok
    }));
}

function normalizePrestasi(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map(p => ({
        id_prestasi: p.id != null ? String(p.id) : p.id_prestasi,
        nama_pemenang: p.namaPemenang ?? p.nama_pemenang,
        bidang_lomba: p.bidangLomba ?? p.bidang_lomba,
        jurusan_timkom: p.jurusanTimkom ?? p.jurusan_timkom,
        lokasi_lomba: p.lokasiLomba ?? p.lokasi_lomba,
        angkatan: p.angkatan != null ? String(p.angkatan) : p.angkatan,
        tahun_perlombaan: p.tahunPerlombaan != null ? String(p.tahunPerlombaan) : p.tahun_perlombaan,
        peringkat_perlombaan: p.peringkatPerlombaan ?? p.peringkat_perlombaan,
        tingkat_perlombaan: p.tingkatPerlombaan ?? p.tingkat_perlombaan,
        foto_pemenangurl: p.fotoPemenangUrl ?? p.fotoPemenangurl ?? p.foto_pemenangurl,
    }));
}

const SKELETON = {
    memberCard: () =>
        `<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center min-h-[220px] justify-center">
            <div class="skeleton-circle h-24 w-24 rounded-full mb-4"></div>
            <div class="skeleton-line h-5 w-32 rounded mb-2"></div>
            <div class="skeleton-line h-4 w-16 rounded mb-2"></div>
            <div class="skeleton-line h-4 w-24 rounded"></div>
        </div>`,
    angkatanCard: () =>
        `<div class="block bg-white border border-gray-200 p-5 rounded-xl text-center shadow-sm animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>`,
    yearCard: () =>
        `<div class="block bg-gray-50 border border-gray-200 p-4 rounded-xl text-center min-h-[60px] flex items-center justify-center">
            <div class="skeleton-line h-6 w-16 rounded mx-auto"></div>
        </div>`,
    prestasiCard: () =>
        `<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 min-h-[140px] flex flex-col justify-center">
            <div class="flex justify-between gap-3 mb-3">
                <div class="skeleton-line h-3 w-16 rounded"></div>
                <div class="skeleton-line h-5 w-14 rounded-full"></div>
            </div>
            <div class="skeleton-line h-6 w-full rounded mb-2"></div>
            <div class="skeleton-line h-4 w-3/4 rounded"></div>
        </div>`,
};

function createLazyCard(slot, item, renderCard, options = {}) {
    const opts = { rootMargin: '120px', threshold: 0.01, ...options };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const rendered = renderCard(item);
            el.innerHTML = '';
            el.classList.remove('lazy-slot');
            if (typeof rendered === 'string') el.innerHTML = rendered;
            else if (rendered && rendered.nodeType) el.appendChild(rendered);
            observer.unobserve(el);
        });
    }, opts);
    observer.observe(slot);
}

async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error: ' + res.status);
    const data = await res.json();
    if (data && Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && data.items && Array.isArray(data.items)) return data.items;
    return data;
}