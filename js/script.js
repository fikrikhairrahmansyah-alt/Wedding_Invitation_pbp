
const CONFIG = {
  coupleShort: "Woody & Bo Peep",                  
  initials: "W & B",                               
  weddingDate: "2027-02-14T08:00:00+07:00",         
  dateText: "Minggu, 14 Februari 2027",             
  heroPhoto: "assets/images/woodybopeep.jpg",        
  groom: {
    name: "Sheriff Woody Pride",
    parents: "Putra dari Bapak Hendra & Ibu Sari",
    bio: "Pencinta kopi dan malam yang tenang.",
    ig: "https://www.instagram.com/fkhri.sja/",
    photo: "assets/images/woody.jpg"
  },                                               
  bride: {
    name: "Bo Peep",
    parents: "Putri dari Bapak Wibowo & Ibu Lestari",
    bio: "Suka buku, bunga, dan hujan sore.",
    ig: "https://www.instagram.com/davinaakaramoy/",
    photo: "assets/images/bopeep.jpg"
  },                                               
  story: [                                        
    {
      title: "First Meet",
      when: "Agustus 2019",
      text: "Bertemu pertama kali di sebuah acara kampus. Obrolan singkat yang terasa panjang."
    },
    {
      title: "Relationship",
      when: "Maret 2021",
      text: "Memutuskan berjalan bersama, saling belajar dan saling menguatkan."
    },
    {
      title: "Engagement",
      when: "Oktober 2026",
      text: "Sebuah malam sederhana, sebuah pertanyaan, dan satu jawaban: ya."
    },
    {
      title: "Wedding Day",
      when: "14 Februari 2027",
      text: "Kami memulai bab baru, dan ingin Anda ada di dalamnya."
    }
  ],
  events: [                                        // CONTOH
    {
      title: "Akad Nikah",
      time: "08.00 - 10.00 WIB",
      place: "Cha S One",
      address: "Jl. Ketintang Sel. No.95, Karah, Kec. Jambangan, Surabaya, Jawa Timur 60232",
      map: "https://maps.app.goo.gl/FrPSiGHst2L5ekwFA"
    },
    {
      title: "Resepsi",
      time: "18.30 - 21.00 WIB",
      place: "Gedung MAN Nhur",
      address: "Jl. Raya Menur No.120, Kertajaya, Kec. Gubeng, Surabaya, Jawa Timur 60282",
      map: "https://maps.app.goo.gl/shTwr4TGB4JNtwrCA"
    }
  ],
  gallery: [
    "assets/images/woody1.jpg",
    "assets/images/potretwopeep.jpg",
    "assets/images/peep1.jpg",
    "assets/images/wod.jpg"
  ],  // ganti dengan foto asli
  musicUrl: "assets/audio/Kasih - Aera.mp3",      
};

/* ===== Helper ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));
const hasBootstrap = typeof bootstrap !== "undefined";   
const toast = hasBootstrap ? new bootstrap.Toast($("#toast"), { delay: 3500 }) : null;

function notify(msg) {
  if (toast) {
    $("#toastBody").textContent = msg;
    toast.show();
  } else {
    alert(msg);
  }
}

/* ===== Render konten dari CONFIG ===== */
function renderContent() {
  $$("[data-c]").forEach(el => el.textContent = CONFIG[el.dataset.c]);
  $("#heroImg").src = CONFIG.heroPhoto;

  const person = p => `
    <div class="col-12 col-md reveal">
      <div class="photo-round">
        <img src="${esc(p.photo)}" alt="Foto ${esc(p.name)}">
      </div>
      <h3>${esc(p.name)}</h3>
      <p class="small text-muted2">${esc(p.parents)}</p>
      <p class="text-muted2">${esc(p.bio)}</p>
      <a class="ig" href="${esc(p.ig)}" target="_blank" rel="noopener">Instagram</a>
    </div>
  `;

  $("#coupleRow").innerHTML = person(CONFIG.groom) + '<div class="col-md-auto d-none d-md-block amp">&amp;</div>' + person(CONFIG.bride);

  $("#timeline").innerHTML = CONFIG.story.map(s => `
    <article class="reveal">
      <time>${esc(s.when)}</time>
      <h3 class="fs-3">${esc(s.title)}</h3>
      <p class="mb-0">${esc(s.text)}</p>
    </article>
  `).join("");

  $("#events").innerHTML = CONFIG.events.map(e => `
    <div class="col-12 col-md-6 col-lg-5 reveal">
      <div class="card h-100 text-center p-4">
        <h3>${esc(e.title)}</h3>
        <p class="mb-0">${esc(CONFIG.dateText)}</p>
        <p>${esc(e.time)}</p>
        <p class="text-muted2 small">
          <strong class="fw-medium text-body">${esc(e.place)}</strong><br>
          ${esc(e.address)}
        </p>
        <div>
          <a class="btn btn-outline-gold px-4" href="${esc(e.map)}" target="_blank" rel="noopener">Lihat Lokasi</a>
        </div>
      </div>
    </div>
  `).join("");

  try {
    const to = new URLSearchParams(location.search).get("to");
    if (to) $("#guest").textContent = "Kepada Yth. " + to;
  } catch (_) {}
}

/* ===== Countdown real-time (berhenti saat waktu tercapai) ===== */
function initCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const boxes = $$("[data-countdown]");
  const timer = setInterval(update, 1000);

  function update() {
    const s = Math.floor(Math.max(0, target - Date.now()) / 1000);
    const parts = [
      ["Hari", Math.floor(s / 86400)],
      ["Jam", Math.floor(s % 86400 / 3600)],
      ["Menit", Math.floor(s % 3600 / 60)],
      ["Detik", s % 60]
    ];
    const html = parts.map(([l, n]) => `
      <div>
        <b>${String(n).padStart(2, "0")}</b>
        <span>${l}</span>
      </div>
    `).join("");

    boxes.forEach(b => b.innerHTML = html);
    if (s === 0) {
      clearInterval(timer);
      $("#cdDone").hidden = false;
    }
  }
  update();
}

/* ===== Galeri + lightbox (Bootstrap Modal) ===== */
function initGallery() {
  const photos = CONFIG.gallery;
  const el = $("#lightbox");
  const modal = hasBootstrap ? new bootstrap.Modal(el) : null;
  let cur = 0;

  $("#grid").innerHTML = photos.map((p, i) => `
    <div class="col-6 col-md-3">
      <button class="gallery-item" data-i="${i}" aria-label="Buka foto ${i + 1}">
        <img src="${esc(p)}" alt="Foto galeri ${i + 1}" loading="lazy">
      </button>
    </div>
  `).join("");

  const show = i => {
    cur = (i + photos.length) % photos.length;
    $("img", el).src = photos[cur];
  };

  $("#grid").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b && modal) {
      show(+b.dataset.i);
      modal.show();
    }
  });

  $("#prevPhoto").onclick = () => show(cur - 1);
  $("#nextPhoto").onclick = () => show(cur + 1);

  el.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
}

/* ===== Validasi form (Bootstrap is-invalid) ===== */
function check(input, ok) {
  input.classList.toggle("is-invalid", !ok);
  return ok;
}

function initRsvp() {
  $("#rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rsvpName");
    const status = $("#rsvpStatus");
    const valid = [
      check(name, name.value.trim().length >= 3),
      check(status, status.value !== "")
    ].every(Boolean);

    if (!valid) return notify("Lengkapi data yang wajib diisi.");

    // Simulasi: tidak ada backend, data tidak dikirim ke mana pun.
    notify(`Terima kasih, ${name.value.trim()}. Formulir valid (simulasi, data belum terkirim).`);
    e.target.reset();
  });
}

/* ===== Musik ===== */
function initMusic() {
  const btn = $("#music");
  let playing = false;
  const audio = CONFIG.musicUrl ? Object.assign(new Audio(CONFIG.musicUrl), { loop: true }) : null;
  const sync = () => btn.textContent = playing ? "❚❚" : "♪";

  const toggle = () => {
    if (!audio) return notify("Musik belum diatur. Isi CONFIG.musicUrl.");
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => notify("Musik tidak dapat diputar."));
    }
    playing = !playing;
    sync();
  };

  btn.addEventListener("click", toggle);
  return () => {
    if (audio) {
      audio.play().then(() => {
        playing = true;
        sync();
      }).catch(() => {});
    }
  };
}

/* ===== Bintang halus di opening ===== */
function initStars() {
  $("#stars").innerHTML = Array.from({ length: 40 }, () => `
    <i class="star" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${(Math.random() * 4).toFixed(1)}s"></i>
  `).join("");
}
  
/* ===== Scroll reveal ===== */
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) {
      x.target.classList.add("visible");
      io.unobserve(x.target);
    }
  }), { threshold: 0.12 });

  $$(".reveal").forEach(el => io.observe(el));
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Tombol buka didaftarkan lebih dulu agar tetap berfungsi walau bagian lain error
  let startMusic = () => {};

  $("#openBtn").addEventListener("click", () => {
    $("#cover").classList.add("hide");
    document.body.classList.remove("locked");
    document.body.classList.add("open");
    startMusic();
    window.scrollTo(0, 0);
  });

  [
    renderContent,
    initStars,
    initCountdown,
    initGallery,
    initRsvp,
    initReveal
  ].forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error(fn.name, err);
    }
  });

  try {
    startMusic = initMusic();
  } catch (err) {
    console.error("initMusic", err);
  }

  if (hasBootstrap) {
    $$(".navbar-nav .nav-link").forEach(a => a.addEventListener("click", () => bootstrap.Collapse.getInstance($("#nv"))?.hide()));
  }

  if (!hasBootstrap) {
    console.warn("Bootstrap gagal dimuat. Periksa koneksi internet.");
  }
});