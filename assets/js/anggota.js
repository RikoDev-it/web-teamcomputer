const PAGE_SIZE = 20;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetAngkatan = urlParams.get('angkatan');
    if (!targetAngkatan) {
        window.location.href = 'index.html';
        return;
    }

    let currentPage = 1;
    let isLoading = false;
    let totalCount = null;
    let loadedCount = 0;
    let hasMore = true;

    const angkatanSpan = document.getElementById('angkatan');
    const angkatanSpan2 = document.getElementById('angkatan1');
    const grid = document.getElementById('members-grid');

    angkatanSpan.textContent = targetAngkatan;
    angkatanSpan2.textContent = targetAngkatan;

    /* ---- Modal & Lightbox ---- */
    const modalMember = document.getElementById('modal-member');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    window.closeModal = () => modalMember.classList.add('hidden');
    window.closeLightbox = () => lightbox.classList.add('hidden');
    window.openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
    };

    const modalFields = {
        'm-name': (m) => m.nama,
        'm-full-name': (m) => m.nama,
        'm-role': (m) => m.jabatan,
        'm-batch': (m) => m.angkatan,
        'm-major': (m) => m.jurusan,
        'm-dob': (m) => m.tanggal_lahir,
        'm-email': (m) => m.email,
        'm-address': (m) => m.alamat,
    };

    function openModal(m) {
        if (!m) return;
        
        // Isi field teks biasa
        Object.entries(modalFields).forEach(([id, getter]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = getter(m) || '-';
        });

        // Logika Foto
        const photoEl = document.getElementById('m-photo');
        const foto = (m.foto_url || '').trim() ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama || '')}&background=0D8ABC&color=fff&size=128`;
        photoEl.src = foto;
        photoEl.onerror = function () {
            this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama || '')}&background=0D8ABC&color=fff&size=128`;
        };
        photoEl.onclick = () => window.openLightbox(photoEl.src);

        // --- Logika Social Media ---
        const igLink = document.getElementById('m-instagram-link');
        const ttLink = document.getElementById('m-tiktok-link');
        const socialEmpty = document.getElementById('m-social-empty');

        let hasSocial = false;

        // Instagram: Hilangkan spasi/null, buat link
        if (m.instagram && m.instagram.trim() !== "") {
            igLink.href = `https://www.instagram.com/${m.instagram.trim()}`;
            igLink.classList.remove('hidden');
            hasSocial = true;
        } else {
            igLink.classList.add('hidden');
        }

        // Tiktok: Hilangkan spasi/null, buat link dengan @
        if (m.tiktok && m.tiktok.trim() !== "") {
            const username = m.tiktok.trim().replace('@', ''); // hapus @ jika user sudah menginputnya
            ttLink.href = `https://www.tiktok.com/@${username}`;
            ttLink.classList.remove('hidden');
            hasSocial = true;
        } else {
            ttLink.classList.add('hidden');
        }

        // Tampilkan "-" jika tidak ada sosmed sama sekali
        if (!hasSocial) socialEmpty.classList.remove('hidden');
        else socialEmpty.classList.add('hidden');

        modalMember.classList.remove('hidden');
    }

    lightbox.addEventListener('click', window.closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!lightbox.classList.contains('hidden')) window.closeLightbox();
            else if (!modalMember.classList.contains('hidden')) window.closeModal();
        }
    });

    /* ---- Render member card ---- */
    function createMemberCard(m) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center card-zoom cursor-pointer';
        div.onclick = () => openModal(m);
        const foto = (m.foto_url || '').trim() ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama || '')}&background=0D8ABC&color=fff&size=128`;
        div.innerHTML = `
            <img src="${foto}" loading="lazy" class="h-24 w-24 rounded-full object-cover mb-4 border-2 border-gray-100" alt="${m.nama || ''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama || '')}&background=0D8ABC&color=fff&size=128'">
            <h4 class="font-bold text-gray-900 text-lg">${m.nama || '-'}</h4>
            <span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">${m.angkatan}</span>
            <p class="text-brand-600 text-sm font-medium mt-2">${m.jabatan || '-'}</p>
        `;
        return div;
    }

    function appendLazyCards(members) {
        members.forEach((m) => {
            const slot = document.createElement('div');
            slot.className = 'lazy-slot';
            slot.innerHTML = SKELETON.memberCard();
            grid.appendChild(slot);
            createLazyCard(slot, m, (item) => createMemberCard(item));
        });
    }

    function showSkeleton(count = 6) {
        grid.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.innerHTML = SKELETON.memberCard();
            grid.appendChild(div.firstElementChild);
        }
    }

    function renderMembers(list, append = false) {
        if (!append) grid.innerHTML = '';
        if (!list || list.length === 0) {
            if (!append) grid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">Data tidak ditemukan.</p>';
            return;
        }
        const normalized = normalizeAnggota(list);
        appendLazyCards(normalized);
    }

    function extractListAndTotal(raw, res) {
        const list = Array.isArray(raw) ? raw : raw?.data || raw?.items || [];
        const headerTotal = res?.headers?.get('X-Total-Count') || res?.headers?.get('x-total-count');
        const bodyTotal =
            raw?.totalCount ??
            raw?.total ??
            raw?.meta?.total ??
            raw?.pagination?.total;
        const total = headerTotal ? parseInt(headerTotal, 10) : (bodyTotal != null ? parseInt(bodyTotal, 10) : null);
        return { list, total };
    }

    async function loadPage(page, append = false) {
        if (isLoading) return;
        isLoading = true;
        if (!append) showSkeleton(6);
        try {
            const url = API_ENDPOINTS.daftarAnggota(targetAngkatan, page, PAGE_SIZE);
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.statusText);
            const raw = await res.json();
            const { list, total } = extractListAndTotal(raw, res);
            if (total != null && !Number.isNaN(total)) totalCount = total;
            renderMembers(list, append);
            loadedCount += list.length;
            if (totalCount != null) {
                hasMore = loadedCount < totalCount;
            } else {
                // Fallback: jika ukuran halaman kurang dari PAGE_SIZE, berarti sudah habis
                hasMore = list.length === PAGE_SIZE;
            }
        } catch (e) {
            if (!append) {
                grid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">Gagal memuat data. Periksa koneksi anda.</p>';
            }
        } finally {
            isLoading = false;
        }
    }

    function handleScroll() {
        if (isLoading || !hasMore) return;
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
        if (nearBottom) {
            currentPage++;
            loadPage(currentPage, true);
        }
    }

    let scrollThrottle;
    window.addEventListener('scroll', () => {
        if (scrollThrottle) return;
        scrollThrottle = requestAnimationFrame(() => {
            handleScroll();
            scrollThrottle = null;
        });
    }, { passive: true });

    loadPage(currentPage, false);
});
