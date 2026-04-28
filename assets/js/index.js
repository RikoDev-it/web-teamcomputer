// Data dari API (anggota: list angkatan + count; prestasi: tahun + daftar)
let dataAngkatanList = []; // dari API get-angkatan: number[] atau { angkatan, totalCount }[]
let dataTahunPrestasi = []; // dari API get-tahun
let dataPrestasiTotal = 0; // total prestasi (untuk stat)

// ---- Modal Pembina ----
const pembinaData = {
    nama: 'DIDIK KURNIAWAN S.Kom,M.T.I',
    jabatanTim: 'Pembina',
    unitInstansi: 'Guru SMKN 1 LIWA, Pendiri Team Computer SMKN 1 LIWA, serta pendiri SMA / SMK IT Dark El Fath School',
    pendidikanTerakhir: 'S2',
    peran: 'Mengawal arah visi dan program Team Computer, memberikan bimbingan teknis maupun karakter, serta menjadi penghubung antara kegiatan tim dengan kebijakan sekolah.',
};

function initPembinaModal() {
    const cardPembina = document.getElementById('card-pembina');
    const pembinaAvatar = document.getElementById('pembina-avatar');
    const pbModal = document.getElementById('modal-pembina');
    const pbBackdrop = document.getElementById('pb-backdrop');
    const pbClose = document.getElementById('pb-close');
    const pbPhoto = document.getElementById('pb-photo');
    const pbNameHeader = document.getElementById('pb-name-header');
    const pbFullName = document.getElementById('pb-full-name');
    const pbRole = document.getElementById('pb-role');
    const pbUnit = document.getElementById('pb-unit');
    const pbEdu = document.getElementById('pb-edu');
    const pbPeran = document.getElementById('pb-peran');

    const pembinaLightbox = document.getElementById('pembina-lightbox');
    const pembinaLightboxImg = document.getElementById('pembina-lightbox-img');

    if (!cardPembina || !pbModal) return;

    function openPembinaModal() {
        pbNameHeader.textContent = pembinaData.nama;
        pbFullName.textContent = pembinaData.nama;
        pbRole.textContent = pembinaData.jabatanTim;
        pbUnit.textContent = pembinaData.unitInstansi;
        pbEdu.textContent = pembinaData.pendidikanTerakhir;
        pbPeran.textContent = pembinaData.peran;
        pbPhoto.src = pembinaAvatar ? pembinaAvatar.src : '';
        pbModal.classList.remove('hidden');
    }

    function closePembinaModal() {
        pbModal.classList.add('hidden');
    }

    function openPembinaLightbox(src) {
        if (!src || !pembinaLightbox || !pembinaLightboxImg) return;
        pembinaLightboxImg.src = src;
        pembinaLightbox.classList.remove('hidden');
    }

    function closePembinaLightbox() {
        if (!pembinaLightbox) return;
        pembinaLightbox.classList.add('hidden');
    }

    cardPembina.addEventListener('click', openPembinaModal);
    cardPembina.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPembinaModal();
        }
    });

    pbClose.addEventListener('click', closePembinaModal);
    pbBackdrop.addEventListener('click', closePembinaModal);

    pbPhoto.addEventListener('click', () => {
        openPembinaLightbox(pbPhoto.src);
    });

    if (pembinaLightbox) {
        pembinaLightbox.addEventListener('click', closePembinaLightbox);
    }
}

// ---- Modal Bidang (NSA / LDW / DESIGNER / MULTIMEDIA) ----
function initBidangModal() {
    const modalBidang = document.getElementById('modal-bidang');
    const bidangBadge = document.getElementById('bidang-badge');
    const bidangTitle = document.getElementById('bidang-title');
    const bidangDesc = document.getElementById('bidang-desc');
    const bidangPoints = document.getElementById('bidang-points');
    const bidangCloseBtn = document.getElementById('bidang-close');
    const bidangCloseBtn2 = document.getElementById('bidang-close-2');

    if (!modalBidang) return;

    const bidangContent = {
        nsa: {
            badge: 'NSA',
            title: 'Network System Administrator',
            desc: 'Bidang yang fokus pada pengelolaan jaringan, server, dan keamanan sistem agar layanan IT berjalan stabil dan aman.',
            points: [
                'Konfigurasi LAN/WLAN, IP address, subnetting',
                'Instalasi & manajemen server (Linux/Windows)',
                'Keamanan jaringan dasar (firewall, hardening)',
                'Monitoring & troubleshooting jaringan',
            ],
        },
        ldw: {
            badge: 'LDW',
            title: 'Laman Desain Web',
            desc: 'Bidang yang fokus pada pembuatan website modern: tampilan menarik, responsif, dan fungsional.',
            points: [
                'HTML, CSS, JavaScript dasar',
                'UI/UX web sederhana (layout, warna, typography)',
                'Responsive design (mobile/desktop)',
                'Deploy/publish website & optimasi dasar',
            ],
        },
        designer: {
            badge: 'DESIGNER',
            title: 'Desainer',
            desc: 'Bidang yang fokus pada identitas visual dan kebutuhan desain untuk konten digital maupun branding.',
            points: [
                'Dasar desain (komposisi, warna, grid, tipografi)',
                'Desain logo, poster, dan konten sosial media',
                'Brand guideline sederhana',
                'Workflow desain (revisi, export aset)',
            ],
        },
        multimedia: {
            badge: 'MULTIMEDIA',
            title: 'Multimedia',
            desc: 'Bidang yang fokus pada produksi konten: editing video, animasi sederhana, dan dokumentasi kegiatan.',
            points: [
                'Editing video (cut, transisi, audio)',
                'Motion/animasi sederhana',
                'Teknik dasar pengambilan gambar (angle, lighting)',
                'Export & kompresi untuk upload',
            ],
        },
    };

    let lastActiveEl = null;
    let lastBodyOverflow = '';

    function openBidang(key) {
        const data = bidangContent[key];
        if (!data) return;

        lastActiveEl = document.activeElement;
        lastBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        bidangBadge.textContent = data.badge;
        bidangTitle.textContent = data.title;
        bidangDesc.textContent = data.desc;

        bidangPoints.innerHTML = '';
        data.points.forEach((t) => {
            const li = document.createElement('li');
            li.textContent = t;
            bidangPoints.appendChild(li);
        });

        modalBidang.classList.remove('hidden');
        modalBidang.setAttribute('aria-hidden', 'false');
        bidangCloseBtn.focus();
    }

    function closeBidang() {
        modalBidang.classList.add('hidden');
        modalBidang.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = lastBodyOverflow || '';

        if (lastActiveEl && typeof lastActiveEl.focus === 'function') {
            lastActiveEl.focus();
        }
    }

    document.querySelectorAll('[data-bidang]').forEach((card) => {
        const key = card.dataset.bidang;
        card.addEventListener('click', () => openBidang(key));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openBidang(key);
            }
        });
    });

    bidangCloseBtn.addEventListener('click', closeBidang);
    bidangCloseBtn2.addEventListener('click', closeBidang);
    modalBidang.addEventListener('click', (e) => {
        if (e.target === modalBidang) closeBidang();
    });

    return { modalBidang, closeBidang };
}

// ---- Stats: 3 angkatan terbaru + semua prestasi ----
function parseListResponse(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
}

function getTop3Angkatan() {
    const list = dataAngkatanList.map((x) => {
        const angkatan = typeof x === 'object' && x != null && 'angkatan' in x ? String(x.angkatan) : String(x);
        return angkatan;
    });
    const sorted = list.sort((a, b) => Number(b) - Number(a));
    return sorted.slice(0, 3);
}

async function computeAnggotaAktif() {
    const top3 = getTop3Angkatan();
    if (top3.length === 0) return 0;
    let total = 0;
    for (const angkatan of top3) {
        try {
            const url = API_ENDPOINTS.daftarAnggota(angkatan, 1, 500);
            const res = await fetch(url);
            const data = await res.json();
            const list = parseListResponse(data);
            total += list.length;
        } catch {}
    }
    return total;
}

async function computeTotalPrestasi() {
    const years = dataTahunPrestasi
        .map((y) => (typeof y === 'object' && y != null && 'tahun' in y ? y.tahun : y))
        .filter((y) => y != null);
    if (years.length === 0) return 0;
    let total = 0;
    for (const tahun of years) {
        try {
            const url = API_ENDPOINTS.prestasiTimkom(tahun);
            const data = await apiGet(url);
            const list = parseListResponse(data);
            total += list.length;
        } catch {}
    }
    return total;
}

function renderStats(anggotaCount) {
    const statAnggota = document.getElementById('stat-anggota');
    const statPrestasi = document.getElementById('stat-prestasi');
    if (statAnggota) statAnggota.innerText = String(anggotaCount ?? 0);
    if (statPrestasi) statPrestasi.innerText = String(dataPrestasiTotal);
}

function createAngkatanCard(thn) {
    const card = document.createElement('a');
    card.href = `anggota.html?angkatan=${encodeURIComponent(thn)}`;
    card.className =
        'block bg-white hover:bg-lb-blue hover:text-white border border-gray-200 p-5 rounded-xl text-center transition transform hover:-translate-y-1 shadow-sm hover:shadow-md text-gray-700 hover:border-lb-blue group';

    card.innerHTML = `
        <h3 class="text-xl font-bold text-lb-black group-hover:text-white transition-colors">
            Angkatan ${thn}
        </h3>
    `;
    return card;
}

function createYearCard(y) {
    const card = document.createElement('a');
    card.href = `prestasi.html?tahun=${encodeURIComponent(y)}`;
    card.className =
        'block bg-gray-50 border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:bg-lb-blue hover:text-white hover:border-lb-blue transition font-bold text-gray-700';
    card.innerText = y;
    return card;
}

function showAngkatanSkeleton() {
    const grid = document.getElementById('angkatan-grid');
    if (!grid) return
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        div.innerHTML = SKELETON.angkatanCard();
        grid.appendChild(div.firstElementChild);
    }
}

function showYearsSkeleton() {
    const grid = document.getElementById('years-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        div.innerHTML = SKELETON.yearCard();
        grid.appendChild(div.firstElementChild);
    }
}

function renderAngkatanGrid() {
    const grid = document.getElementById('angkatan-grid');
    if (!grid) return;
    if (dataAngkatanList.length === 0) {
        grid.innerHTML = '';
        return;
    }

    const list = dataAngkatanList.map((x) =>
        typeof x === 'object' && x != null && 'angkatan' in x
            ? { angkatan: String(x.angkatan), count: x.totalCount != null ? x.totalCount : null }
            : { angkatan: String(x), count: null }
    );
    grid.innerHTML = '';
    list.forEach(({ angkatan: thn, count }) => {
        const slot = document.createElement('div');
        slot.className = 'lazy-slot';
        slot.innerHTML = SKELETON.angkatanCard();
        grid.appendChild(slot);
        createLazyCard(slot, { thn, count }, (item) => createAngkatanCard(item.thn, item.count));
    });
}

function renderPrestasiYears() {
    const yearGrid = document.getElementById('years-grid');
    if (!yearGrid) return;
    if (dataTahunPrestasi.length === 0) {
        yearGrid.innerHTML = '';
        return;
    }

    const years = dataTahunPrestasi
        .map((y) => (typeof y === 'object' && y != null && 'tahun' in y ? y.tahun : y))
        .filter((y) => y != null)
        .sort((a, b) => Number(b) - Number(a));
    yearGrid.innerHTML = '';
    years.forEach((y) => {
        const slot = document.createElement('div');
        slot.className = 'lazy-slot';
        slot.innerHTML = SKELETON.yearCard();
        yearGrid.appendChild(slot);
        createLazyCard(slot, y, (item) => createYearCard(item));
    });
}

// ---- ScrollSpy Navbar ----
function initScrollSpy() {
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) current = section.getAttribute('id');
        });
        document.querySelectorAll('nav a').forEach((a) => {
            a.classList.remove('nav-active');
            if (a.getAttribute('href') && a.getAttribute('href').includes(current)) {
                a.classList.add('nav-active');
            }
        });
    });
}

// ---- ESC Key handler global (pembina + bidang) ----
function initGlobalEscHandler(modalBidangRef, closeBidang) {
    const pbModal = document.getElementById('modal-pembina');
    const pembinaLightbox = document.getElementById('pembina-lightbox');

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;

        if (pembinaLightbox && !pembinaLightbox.classList.contains('hidden')) {
            pembinaLightbox.classList.add('hidden');
        } else if (pbModal && !pbModal.classList.contains('hidden')) {
            pbModal.classList.add('hidden');
        } else if (modalBidangRef && !modalBidangRef.classList.contains('hidden')) {
            closeBidang();
        }
    });
}

// ---- Inisialisasi halaman utama ----
document.addEventListener('DOMContentLoaded', () => {
    initPembinaModal();
    const bidangCtx = initBidangModal();
    initScrollSpy();
    if (bidangCtx) {
        initGlobalEscHandler(bidangCtx.modalBidang, bidangCtx.closeBidang);
    }

    // Skeleton loading
    showAngkatanSkeleton();
    showYearsSkeleton();

    // Load data dari backend API
    (async function loadFromApi() {
        try {
            const [angkatans, years] = await Promise.all([
                apiGet(API_ENDPOINTS.getAngkatan()).then((r) => parseListResponse(r)),
                apiGet(API_ENDPOINTS.getTahunPrestasi()).then((r) => parseListResponse(r)),
            ]);
            dataAngkatanList = angkatans;
            dataTahunPrestasi = years;

            const [anggotaCount, prestasiTotal] = await Promise.all([
                computeAnggotaAktif(),
                computeTotalPrestasi(),
            ]);
            dataPrestasiTotal = prestasiTotal;
            renderStats(anggotaCount);
            renderAngkatanGrid();
            renderPrestasiYears();
        } catch (e) {
            console.error('Gagal memuat data dari backend:', e);
            const ag = document.getElementById('angkatan-grid');
            const yg = document.getElementById('years-grid');
            if (ag) ag.innerHTML = '<p class="col-span-4 text-center text-gray-500 py-4">Gagal memuat data.</p>';
            if (yg) yg.innerHTML = '<p class="col-span-4 text-center text-gray-500 py-4">Gagal memuat data.</p>';
            renderStats(0);
        }
    })();
});
