document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tahun = urlParams.get('tahun');

    const displayYear = document.getElementById('display-year');
    const grid = document.getElementById('ach-grid');

    if (!tahun) {
        window.location.href = 'index.html#prestasi';
        return;
    }
    displayYear.textContent = tahun;

    /* ---- Modal ---- */
    const modalPrestasi = document.getElementById('modal-prestasi');
    const prImg = document.getElementById('pr-img');
    const prTitle = document.getElementById('pr-title');
    const prBidang = document.getElementById('pr-bidang');
    const prJurusan = document.getElementById('pr-jurusan');
    const prLokasi = document.getElementById('pr-lokasi');
    const prAngkatan = document.getElementById('pr-angkatan');
    const prTahun = document.getElementById('pr-tahun');
    const prPeringkat = document.getElementById('pr-peringkat');
    const prTingkat = document.getElementById('pr-tingkat');
    const prClose = document.getElementById('pr-close');
    const prClose2 = document.getElementById('pr-close-2');
    const photoViewer = document.getElementById('photo-viewer');
    const pvImg = document.getElementById('pv-img');

    let lastActiveEl = null;
    let lastBodyOverflow = '';

    function openPrestasi(p) {
        lastActiveEl = document.activeElement;
        lastBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        prImg.src = p.foto_pemenangurl || '';
        prTitle.textContent = p.nama_pemenang || '-';
        prBidang.textContent = p.bidang_lomba || '-';
        prJurusan.textContent = p.jurusan_timkom || '-';
        prLokasi.textContent = p.lokasi_lomba || '-';
        prAngkatan.textContent = p.angkatan || '-';
        prTahun.textContent = p.tahun_perlombaan || '-';
        prPeringkat.textContent = p.peringkat_perlombaan ?? '-';
        prTingkat.textContent = p.tingkat_perlombaan || '-';

        modalPrestasi.classList.remove('hidden');
        modalPrestasi.setAttribute('aria-hidden', 'false');
        prClose.focus();
    }

    function closePrestasi() {
        modalPrestasi.classList.add('hidden');
        modalPrestasi.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = lastBodyOverflow || '';
        if (lastActiveEl && typeof lastActiveEl.focus === 'function') lastActiveEl.focus();
    }

    prClose.addEventListener('click', closePrestasi);
    prClose2.addEventListener('click', closePrestasi);
    modalPrestasi.addEventListener('click', (e) => {
        if (e.target === modalPrestasi) closePrestasi();
    });

    function openPhotoViewer(src) {
        if (!src) return;
        pvImg.src = src;
        photoViewer.classList.remove('hidden');
    }

    function closePhotoViewer() {
        photoViewer.classList.add('hidden');
    }

    prImg.addEventListener('click', () => openPhotoViewer(prImg.src));
    photoViewer.addEventListener('click', closePhotoViewer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!photoViewer.classList.contains('hidden')) closePhotoViewer();
            else if (!modalPrestasi.classList.contains('hidden')) closePrestasi();
        }
    });

    /* ---- Create prestasi card ---- */
    function createPrestasiCard(p) {
        const card = document.createElement('div');
        card.className =
            'bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-zoom cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600/30';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        const peringkat = p.peringkat_perlombaan ?? '-';
        const bidang = p.bidang_lomba || '-';
        const tingkat = p.tingkat_perlombaan || '-';
        card.innerHTML = `
            <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-bold tracking-wide text-gray-500 uppercase">Prestasi</p>
                <span class="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-brand-600">${p.jurusan_timkom || '-'}</span>
            </div>
            <h3 class="mt-3 font-extrabold text-gray-900 text-lg truncate">Juara ${peringkat} ${bidang}</h3>
            <p class="mt-1 text-sm text-gray-600"><span class="font-semibold text-gray-800">Tingkat:</span> ${tingkat}</p>
        `;
        card.addEventListener('click', () => openPrestasi(p));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPrestasi(p);
            }
        });
        return card;
    }

    /* ---- Skeleton loading ---- */
    function showSkeleton(count = 6) {
        grid.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.innerHTML = SKELETON.prestasiCard();
            grid.appendChild(div.firstElementChild);
        }
    }

    showSkeleton(6);

    /* ---- Load data ---- */
    const url = API_ENDPOINTS.prestasiTimkom(tahun);
    fetch(url)
        .then((res) => res.json())
        .then((raw) => {
            let list = [];
            if (Array.isArray(raw)) list = raw;
            else if (raw && Array.isArray(raw.data)) list = raw.data;
            else if (raw && Array.isArray(raw.items)) list = raw.items;

            const dataPrestasi = normalizePrestasi(list);
            const filtered = dataPrestasi.filter((p) => String(p.tahun_perlombaan) === String(tahun));

            if (filtered.length === 0) {
                grid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">Data prestasi untuk tahun ini belum tersedia.</p>';
                return;
            }

            grid.innerHTML = '';
            filtered.forEach((p) => {
                const slot = document.createElement('div');
                slot.className = 'lazy-slot';
                slot.innerHTML = SKELETON.prestasiCard();
                grid.appendChild(slot);
                createLazyCard(slot, p, (item) => createPrestasiCard(item));
            });
        })
        .catch(() => {
            grid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">Gagal memuat data dari backend. Periksa koneksi dan CORS API.</p>';
        });
});
