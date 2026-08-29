const app = document.querySelector("#app");
const audio = document.querySelector("#gift-audio");

const LOCAL_PHOTO_FILES = [
  "1787982437408_132339761693135526_2668400663636240504_14e7e0e828dac7bfd4e21be1a9c732cf.jpg",
  "1787982437435_132339761693135526_2668400663636240504_318277fe60176118a7f2c63795163755.jpg",
  "1787982437453_132339761693135526_2668400663636240504_6c75ce5f378eddafa166cf81aaa8ee58.jpg",
  "1787982437466_132339761693135526_2668400663636240504_e1860a0a3831107d0ddce6ca2537b17e.jpg",
  "1787982437478_132339761693135526_2668400663636240504_3de0905f47a936e6f7b060d7a149eca2.jpg",
  "1787982437489_132339761693135526_2668400663636240504_f5cc4e03c8d2205efa614cb6c519e856.jpg",
  "1787982437501_132339761693135526_2668400663636240504_bcfb2cfff23d3b6b5c9ca3c713569c7d.jpg",
  "1787982437511_132339761693135526_2668400663636240504_a7c834bc08f5d75656a85a63290c0830.jpg",
  "1787982437519_132339761693135526_2668400663636240504_9c7eb52180cf32d787bd8d84eca90f76.jpg",
  "1787982437526_132339761693135526_2668400663636240504_678a0c89619063c01a6f97d0f4d52352.jpg",
  "1787982437534_132339761693135526_2668400663636240504_b26876440e6b7f149fda9888e345169a.jpg",
  "1787982437541_132339761693135526_2668400663636240504_6696062bf32163e7698fc6472de07002.jpg",
  "1787982437549_132339761693135526_2668400663636240504_96bd6159338d1a8ce8f4aea24611a9f0.jpg",
  "1787982437556_132339761693135526_2668400663636240504_97d294a0eab326edc783dc630457ff34.jpg",
  "1787982437563_132339761693135526_2668400663636240504_257a57756db9703c32456c66760ef9d0.jpg",
  "1787982437571_132339761693135526_2668400663636240504_78450e54f0b031d6bb8aa3590d685a85.jpg",
  "1787982437578_132339761693135526_2668400663636240504_054a3a9d1cb6288912500dbab3e9b844.jpg",
  "1787982437585_132339761693135526_2668400663636240504_90f51e9e6d2457e375694cb1534863a4.jpg",
  "1787982437592_132339761693135526_2668400663636240504_fe342cae4f83611a5f1720f4f6931212.jpg",
];

const PHOTO_CAPTIONS = [
  "Có những khoảnh khắc chỉ cần nhớ lại thôi cũng đủ mỉm cười.",
  "Cảm ơn em vì đã làm những ngày bình thường trở nên thật đặc biệt.",
  "Mong chúng mình sẽ còn đi cùng nhau qua thật nhiều ngày như thế.",
  "Một chút dịu dàng, được giữ lại dành riêng cho em.",
  "Mỗi tấm ảnh là một mảnh nhỏ trong câu chuyện của chúng mình.",
  "Và đây chưa phải là kỷ niệm cuối cùng của chúng mình đâu nhé.",
];

const DEMO_PHOTOS = LOCAL_PHOTO_FILES.map((fileName, index) => ({
  id: `memory-${String(index + 1).padStart(2, "0")}`,
  photoUrl: `./image/img/${fileName}`,
  caption: PHOTO_CAPTIONS[index % PHOTO_CAPTIONS.length],
}));

const DEMO_SONGS = [
  {
    id: "ordinary",
    title: "Ordinary",
    artist: "Alex Warren",
    songUrl: "./music/ordinary-alex-warren.mp4",
    coverUrl: DEMO_PHOTOS[0].photoUrl,
  },
  {
    id: "the-gioi-mat-mot-nguoi-co-don",
    title: "Và Thế Giới Đã Mất Đi Một Người Cô Đơn",
    artist: "Dành riêng cho Hồng Châu",
    songUrl: "./music/va-the-gioi-da-mat-di-mot-nguoi-co-don.mp4",
    coverUrl: DEMO_PHOTOS[1].photoUrl,
  },
  {
    id: "nguoi-im-lang-gap-nguoi-hay-noi",
    title: "Người Im Lặng Gặp Người Hay Nói",
    artist: "HIEUTHUHAI",
    songUrl: "./music/nguoi-im-lang-gap-nguoi-hay-noi-hieuthuhai.mp4",
    coverUrl: DEMO_PHOTOS[2].photoUrl,
  },
  {
    id: "lang",
    title: "Lặng",
    artist: "Shiki ft. Tyronee",
    songUrl: "./music/perfect-shiki-ft-tyronee.mp4",
    coverUrl: DEMO_PHOTOS[3].photoUrl,
  },
  {
    id: "thanh-tam",
    title: "Thanh Tâm",
    artist: "Song ca cùng Thùy Chi",
    songUrl: "./music/thanh-tan-thuy-chi.mp4",
    coverUrl: DEMO_PHOTOS[4].photoUrl,
  },
];

const DEMO_GIFT = {
  title: "Những điều mình muốn giữ lại",
  photos: DEMO_PHOTOS,
  songs: DEMO_SONGS,
  letterGreeting:
    "Gửi Hồng Châu, người khiến những ngày bình thường của anh bỗng hóa đặc biệt!",
  letter: [
    'Có những cảm xúc khó có thể diễn tả trọn vẹn bằng lời, nên anh đành cẩn thận gom góp tất cả vào "góc nhỏ" này. Từng giai điệu, vài tấm ảnh, và cả những kỷ niệm của tụi mình đều được anh tự tay chăm chút, xếp đặt chỉ để dành riêng cho em.',
    "Cảm ơn Châu vì đã bước vào thế giới của anh, kiên nhẫn lắng nghe và dịu dàng đồng hành. Sự xuất hiện của em giống như một tia sáng ấm áp, khiến mọi thứ xung quanh anh trở nên ý nghĩa hơn rất nhiều.",
    "Mong bầu trời của em sẽ luôn rực rỡ và nụ cười xinh đẹp ấy sẽ luôn hiện diện trên môi. Dù thế nào, anh vẫn luôn hy vọng mình có thể là một trong những lý do khiến em mỉm cười.",
    "Món quà này nhìn bề ngoài tuy nhỏ, nhưng tâm tư anh đặt vào đó thì chắc chắn không nhỏ chút nào đâu. Mong em sẽ cảm nhận được những gì anh chưa kịp nói thành lời.",
  ],
  letterSignoff: "Quốc",
  giftMessage:
    "Trái tim này không phải món quà cuối cùng — nó là lời hứa rằng anh sẽ còn cùng em tạo thêm thật nhiều kỷ niệm mới.",
};

const PASSCODE = "2508";

const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "clear",
  "0",
  "back",
];
const PETALS = Array.from({ length: 24 }, (_, index) => ({
  left: (index * 37 + 9) % 100,
  delay: ((index * 13) % 31) / 10,
  duration: 2.8 + ((index * 17) % 21) / 10,
  size: 14 + ((index * 11) % 17),
  symbol: ["✿", "♡", "✦", "❀"][index % 4],
}));

const state = {
  gift: DEMO_GIFT,
  phase: "locked",
  pin: "",
  message: "",
  photoIndex: 0,
  photoOpen: false,
  activeSong: 0,
  hasSelectedSong: false,
  isPlaying: false,
  repeatOne: false,
  currentTime: 0,
  duration: 0,
  letterOpening: false,
  letterOpened: false,
  heartOpened: false,
  heartTransition: null,
};

let openingTimer = null;
let letterOpeningTimer = null;
let heartTransitionTimer = null;
let photoSwipeStart = null;
let destroyHeart = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function currentSong() {
  return state.gift.songs[state.activeSong] || state.gift.songs[0];
}

function renderLock() {
  const dots = Array.from(
    { length: PASSCODE.length },
    (_, index) =>
      `<span class="${index < state.pin.length ? "filled" : ""}"></span>`,
  ).join("");
  const keypad = KEYS.map((key) => {
    const secondary = key === "clear" || key === "back";
    const label =
      key === "clear" ? "Xóa hết" : key === "back" ? "Xóa một số" : `Số ${key}`;
    const text = key === "clear" ? "C" : key === "back" ? "⌫" : key;
    return `<button type="button" class="key${secondary ? " key-secondary" : ""}" data-action="key" data-key="${key}" aria-label="${label}">${text}</button>`;
  }).join("");

  return `
    <section class="lock-screen">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <span class="floating-mark mark-one">✿</span>
      <span class="floating-mark mark-two">♡</span>
      <span class="floating-mark mark-three">✦</span>
      <div class="lock-card" aria-labelledby="gift-title">
        <div class="love-stamp" aria-hidden="true"><span>♡</span></div>
        <p class="eyebrow">A little something for you</p>
        <h1 id="gift-title">Mở món quà nhỏ này nhé</h1>
        <p class="intro">Nhập ${PASSCODE.length} con số đặc biệt để xem điều đang chờ bạn ở bên trong.</p>
        <div class="pin-dots" aria-label="Đã nhập ${state.pin.length} trên ${PASSCODE.length} số">${dots}</div>
        <div class="keypad" aria-label="Bàn phím nhập mã">${keypad}</div>
        <button class="unlock-button" data-action="unlock" ${state.pin.length !== PASSCODE.length ? "disabled" : ""}>
          <span>Mở quà</span><span aria-hidden="true">→</span>
        </button>
        <p class="hint">Gợi ý: một ngày rất đặc biệt · Mã mở khóa: 2508</p>
        <p class="status" role="status" aria-live="polite">${escapeHtml(state.message)}</p>
      </div>
      <p class="signature">made with <span>♥</span> for someone special</p>
    </section>
  `;
}

function renderOpening() {
  const petals = PETALS.map(
    (petal) =>
      `<span class="petal" style="--petal-x:${petal.left}vw;--petal-delay:${petal.delay}s;--petal-duration:${petal.duration}s;--petal-size:${petal.size}px">${petal.symbol}</span>`,
  ).join("");
  return `
    <section class="opening-screen" aria-label="Đang mở quà">
      <div class="opening-glow"></div>
      ${petals}
      <div class="opening-note"><span>♡</span><p>Dành riêng cho bạn</p></div>
    </section>
  `;
}

function renderHub() {
  return `
    <section class="gift-hub">
      <header class="hub-heading">
        <p class="eyebrow">For my favorite person</p>
        <h2>Một góc nhỏ dành cho bạn</h2>
        <p>Chạm vào từng món để mở những điều mình đã cất riêng ở đây.</p>
      </header>
      <div class="hub-grid">
        <button class="hub-module module-music" data-action="module" data-module="music">
          <span class="module-icon ${state.isPlaying ? "music-playing" : ""}">♫</span>
          <span class="module-copy"><strong>Danh sách nhạc</strong></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-photos" data-action="module" data-module="photos">
          <span class="module-icon">▣</span>
          <span class="module-copy"><strong>Danh sách ảnh</strong></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-letter" data-action="module" data-module="letter">
          <span class="module-icon">✉</span>
          <span class="module-copy"><strong>Một lá thư</strong></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-gift" data-action="module" data-module="heart">
          <span class="module-icon heart-icon">♥</span>
          <span class="module-copy"><strong>Món quà bí mật</strong></span><span class="module-arrow">↗</span>
        </button>
      </div>
      <p class="hub-signature">4 điều nhỏ · dành cho một người thật đặc biệt</p>
    </section>
  `;
}

function renderTopbar(
  eyebrow,
  title,
  count,
  extraClass = "",
  rightContent = "",
) {
  return `
    <header class="module-topbar ${extraClass}">
      <button class="back-button" data-action="back"><span>←</span> Quay lại</button>
      <div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>
      ${rightContent || `<span class="module-count">${count}</span>`}
    </header>
  `;
}

function renderMusic() {
  const song = currentSong();
  const rows = state.gift.songs
    .map(
      (item, index) => `
    <button class="song-row ${index === state.activeSong ? "active" : ""}" data-action="play-song" data-index="${index}">
      <span class="song-index">${index === state.activeSong && state.isPlaying ? "♫" : String(index + 1).padStart(2, "0")}</span>
      <img src="${escapeHtml(item.coverUrl)}" alt="" />
      <span class="song-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.artist)}</small></span>
      <span class="song-action">${item.songUrl ? "▶" : "· · ·"}</span>
    </button>
  `,
    )
    .join("");

  return `
    <section class="module-screen music-screen">
      ${renderTopbar("Our soundtrack", "Danh sách nhạc", `${String(state.gift.songs.length).padStart(2, "0")} bài`)}
      <div class="music-layout">
        <div class="now-playing-card">
          <div class="vinyl-cover ${state.isPlaying ? "spinning" : ""}">
            <img src="${escapeHtml(song.coverUrl)}" alt="Ảnh bìa bài hát" /><span class="vinyl-center"></span>
          </div>
          <div class="now-playing-copy"><p>${state.isPlaying ? "Đang phát" : state.hasSelectedSong ? "Đang tạm dừng" : "Chọn một bài hát"}</p><h3>${escapeHtml(song.title)}</h3><span>${escapeHtml(song.artist)}</span></div>
          <input id="song-progress" class="song-progress" type="range" min="0" max="${state.duration || 0}" value="${Math.min(state.currentTime, state.duration || 0)}" aria-label="Tiến độ bài hát" />
          <div class="song-time"><span id="current-time">${formatTime(state.currentTime)}</span><span id="duration-time">${formatTime(state.duration)}</span></div>
          <div class="player-controls">
            <button data-action="previous-song" aria-label="Bài trước">‹</button>
            <button class="play-button" data-action="toggle-music" aria-label="${state.isPlaying ? "Tạm dừng" : "Phát"}">${state.isPlaying ? "Ⅱ" : "▶"}</button>
            <button data-action="next-song" aria-label="Bài tiếp">›</button>
          </div>
          <button class="repeat-one-button ${state.repeatOne ? "active" : ""}" data-action="toggle-repeat" aria-pressed="${state.repeatOne}">
            <span aria-hidden="true">↻¹</span> ${state.repeatOne ? "Đang lặp 1 bài" : "Lặp riêng 1 bài"}
          </button>
          <p class="play-mode-copy">${state.repeatOne ? "Bài hiện tại sẽ được phát liên tục." : "Hết bài sẽ tự chuyển bài kế tiếp và quay lại từ đầu."}</p>
        </div>
        <div class="playlist-card">
          <div class="playlist-heading"><span>Playlist</span><small>♡</small></div>
          <div class="song-list">${rows}</div>
          <p class="playlist-message" role="status">${escapeHtml(state.message)}</p>
        </div>
      </div>
    </section>
  `;
}

function renderPhotos() {
  const tiles = state.gift.photos
    .map(
      (photo, index) => `
    <button class="photo-tile tile-${index % 5}" data-action="open-photo" data-index="${index}">
      <img src="${escapeHtml(photo.photoUrl)}" alt="${escapeHtml(photo.caption)}" />
    </button>
  `,
    )
    .join("");

  const activePhoto = state.gift.photos[state.photoIndex];
  const lightbox = state.photoOpen
    ? `
    <div class="photo-lightbox">
      <button class="lightbox-close" data-action="close-photo" aria-label="Đóng ảnh">×</button>
      <article class="photo-card">
        <div class="photo-frame">
          <img src="${escapeHtml(activePhoto.photoUrl)}" alt="${escapeHtml(activePhoto.caption)}" />
          <span class="photo-number">${String(state.photoIndex + 1).padStart(2, "0")}</span>
        </div>
      </article>
    </div>
  `
    : "";

  return `
    <section class="module-screen photo-list-screen">
      ${renderTopbar("Our little archive", "Danh sách ảnh", `${String(state.gift.photos.length).padStart(2, "0")} ảnh`)}
      <div class="photo-list-grid">${tiles}</div>
      ${lightbox}
    </section>
  `;
}

function renderLetter() {
  const paragraphs = state.gift.letter
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  if (!state.letterOpened) {
    return `
      <section class="module-screen letter-screen letter-screen-sealed">
        ${renderTopbar("Words from my heart", "Một lá thư", "03", "letter-topbar")}
        <div class="sealed-letter-stage ${state.letterOpening ? "is-opening" : ""}">
          <div class="sealed-letter-intro">
            <span>Gửi riêng đến em</span>
            <p>Có vài điều anh đã cất thật kỹ trong phong thư này.</p>
          </div>
          <button class="sealed-envelope ${state.letterOpening ? "is-opening" : ""}" data-action="open-letter" aria-label="Mở phong thư để đọc lá thư" ${state.letterOpening ? "disabled" : ""}>
            <span class="sealed-envelope-shadow" aria-hidden="true"></span>
            <span class="sealed-envelope-body" aria-hidden="true"></span>
            <span class="sealed-envelope-flap" aria-hidden="true"></span>
            <span class="sealed-envelope-letter" aria-hidden="true"><i>Gửi Hồng Châu ♡</i></span>
            <span class="sealed-envelope-front" aria-hidden="true"></span>
            <span class="sealed-envelope-seal" aria-hidden="true">♥</span>
          </button>
          <button class="open-letter-hint" data-action="open-letter" ${state.letterOpening ? "disabled" : ""}>
            <span>${state.letterOpening ? "Phong thư đang mở…" : "Chạm vào phong thư để mở"}</span><span aria-hidden="true">♡</span>
          </button>
        </div>
      </section>
    `;
  }

  return `
    <section class="module-screen letter-screen letter-screen-opened">
      ${renderTopbar("Words from my heart", "Một lá thư", "03", "letter-topbar")}
      <div class="letter-wrap letter-wrap-opened">
        <div class="envelope-flap-open" aria-hidden="true"></div>
        <div class="envelope-back" aria-hidden="true"><span>♥</span></div>
        <article class="letter-paper">
          <div class="letter-date">29 · 08 · 2026</div>
          <p class="letter-greeting">${escapeHtml(state.gift.letterGreeting)}</p>
          ${paragraphs}
          <div class="letter-signoff"><span>Thương em,</span><strong>${escapeHtml(state.gift.letterSignoff)} ♡</strong></div>
        </article>
      </div>
    </section>
  `;
}

function renderHeart() {
  const heartTransitioning = Boolean(state.heartTransition);
  return `
    <section class="dark-heart-screen ${state.heartOpened ? "opened" : ""} ${heartTransitioning ? "transitioning" : ""}">
      <button class="dark-back-button" data-action="back"><span>←</span> Quay lại</button>
      <p class="dark-heart-kicker">THE SECRET GIFT · 04</p>
      <div class="particle-heart-wrap">
        <canvas class="particle-heart-canvas" aria-hidden="true"></canvas>
        <button class="particle-heart-hit" data-action="toggle-heart" aria-label="${state.heartOpened ? "Chạm để biến dòng chữ trở lại thành trái tim" : "Chạm để biến trái tim thành dòng chữ"}" ${heartTransitioning ? "disabled" : ""}></button>
      </div>
      <div class="heart-tap-copy ${state.heartOpened ? "showing-text" : ""}">
        <strong>${state.heartOpened ? "Chạm vào dòng chữ" : "Chạm vào trái tim"}</strong>
        <span>${state.heartOpened ? "để gom lại thành trái tim" : "để mở món quà cuối cùng"}</span>
      </div>
      <p class="heart-live-copy" aria-live="polite">${state.heartOpened ? "Mãi thương em Hồng Châu" : ""}</p>
      <button class="dark-music-button" data-action="toggle-music" aria-label="${state.isPlaying ? "Tắt nhạc" : "Bật nhạc"}">${state.isPlaying ? "♫" : "♪"}</button>
      <div class="heart-stars" aria-hidden="true">✦　·　✧　·　✦</div>
    </section>
  `;
}

function render() {
  if (destroyHeart) {
    destroyHeart();
    destroyHeart = null;
  }

  app.className = `reveal-app phase-${state.phase}`;
  const screens = {
    locked: renderLock,
    opening: renderOpening,
    hub: renderHub,
    music: renderMusic,
    photos: renderPhotos,
    letter: renderLetter,
    heart: renderHeart,
  };
  app.innerHTML = screens[state.phase]();

  if (state.phase === "heart") {
    requestAnimationFrame(() => {
      const particleMode =
        state.heartTransition || (state.heartOpened ? "text" : "heart");
      destroyHeart = initParticleHeart(
        document.querySelector(".particle-heart-canvas"),
        particleMode,
      );
    });
  }
}

function openModule(phase) {
  clearTimeout(letterOpeningTimer);
  clearTimeout(heartTransitionTimer);
  state.message = "";
  state.photoOpen = false;
  state.phase = phase;
  state.letterOpening = false;
  if (phase === "letter") state.letterOpened = false;
  if (phase === "heart") {
    state.heartOpened = false;
    state.heartTransition = null;
  }
  render();
}

function pressKey(key) {
  state.message = "";
  if (key === "clear") state.pin = "";
  else if (key === "back") state.pin = state.pin.slice(0, -1);
  else if (state.pin.length < PASSCODE.length) state.pin += key;
  render();
}

function unlock() {
  if (state.pin !== PASSCODE) {
    state.message = "Chưa đúng rồi, thử lại nhé ♡";
    state.pin = "";
    render();
    return;
  }

  state.message = "";
  state.phase = "opening";
  render();
  clearTimeout(openingTimer);
  openingTimer = setTimeout(() => {
    state.phase = "hub";
    render();
  }, 1850);
}

function playSong(index) {
  const song = state.gift.songs[index];
  state.activeSong = index;
  state.hasSelectedSong = true;
  state.message = "";
  state.currentTime = 0;
  state.duration = 0;

  if (!song || !song.songUrl) {
    audio.pause();
    state.isPlaying = false;
    state.message =
      "Bài này đang là dữ liệu mẫu. Thêm song_url trong Supabase để phát nhạc nhé.";
    render();
    return;
  }

  audio.src = song.songUrl;
  render();
  audio.play().catch(() => {
    state.isPlaying = false;
    syncPlaybackUi();
  });
}

function toggleMusic() {
  if (!state.hasSelectedSong) {
    state.hasSelectedSong = true;
    state.message = "";
  }
  const song = currentSong();
  if (!song || !song.songUrl) {
    state.message = "Thêm danh sách nhạc vào Supabase để bật trình phát.";
    if (state.phase === "music") render();
    return;
  }
  if (!audio.src) audio.src = song.songUrl;
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function changePhoto(step) {
  const length = state.gift.photos.length;
  state.photoIndex = (state.photoIndex + step + length) % length;
  render();
}

function syncPlaybackUi() {
  document
    .querySelector(".vinyl-cover")
    ?.classList.toggle("spinning", state.isPlaying);
  const playButton = document.querySelector(".play-button");
  if (playButton) {
    playButton.textContent = state.isPlaying ? "Ⅱ" : "▶";
    playButton.setAttribute(
      "aria-label",
      state.isPlaying ? "Tạm dừng" : "Phát",
    );
  }
  const musicButton = document.querySelector(".dark-music-button");
  if (musicButton) {
    musicButton.textContent = state.isPlaying ? "♫" : "♪";
    musicButton.setAttribute(
      "aria-label",
      state.isPlaying ? "Tắt nhạc" : "Bật nhạc",
    );
  }
}

function syncProgressUi() {
  const progress = document.querySelector("#song-progress");
  const current = document.querySelector("#current-time");
  const duration = document.querySelector("#duration-time");
  if (progress) {
    progress.max = state.duration || 0;
    progress.value = Math.min(state.currentTime, state.duration || 0);
  }
  if (current) current.textContent = formatTime(state.currentTime);
  if (duration) duration.textContent = formatTime(state.duration);
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "key") pressKey(button.dataset.key);
  else if (action === "unlock") unlock();
  else if (action === "module") openModule(button.dataset.module);
  else if (action === "back") openModule("hub");
  else if (action === "play-song") playSong(Number(button.dataset.index));
  else if (action === "toggle-music") toggleMusic();
  else if (action === "toggle-repeat") {
    state.repeatOne = !state.repeatOne;
    render();
  } else if (action === "previous-song")
    playSong(
      (state.activeSong - 1 + state.gift.songs.length) %
        state.gift.songs.length,
    );
  else if (action === "next-song")
    playSong((state.activeSong + 1) % state.gift.songs.length);
  else if (action === "open-photo") {
    state.photoIndex = Number(button.dataset.index);
    state.photoOpen = true;
    render();
  } else if (action === "close-photo") {
    state.photoOpen = false;
    render();
  } else if (action === "previous-photo") changePhoto(-1);
  else if (action === "next-photo") changePhoto(1);
  else if (action === "open-letter") {
    if (state.letterOpening || state.letterOpened) return;
    state.letterOpening = true;
    render();
    clearTimeout(letterOpeningTimer);
    letterOpeningTimer = setTimeout(() => {
      state.letterOpening = false;
      state.letterOpened = true;
      render();
    }, 1250);
  } else if (action === "toggle-heart") {
    if (state.heartTransition) return;
    state.heartOpened = !state.heartOpened;
    state.heartTransition = state.heartOpened ? "to-text" : "to-heart";
    render();
    clearTimeout(heartTransitionTimer);
    heartTransitionTimer = setTimeout(() => {
      state.heartTransition = null;
      document
        .querySelector(".dark-heart-screen")
        ?.classList.remove("transitioning");
      const heartHit = document.querySelector(".particle-heart-hit");
      if (heartHit) heartHit.disabled = false;
    }, 2050);
  }
});

app.addEventListener("input", (event) => {
  if (event.target.matches("#song-progress")) {
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    state.currentTime = nextTime;
    syncProgressUi();
  }
});

app.addEventListener("pointerdown", (event) => {
  if (
    !event.target.closest(".photo-lightbox") ||
    event.target.closest('[data-action="close-photo"]')
  )
    return;
  photoSwipeStart = { x: event.clientX, y: event.clientY };
});

app.addEventListener("pointerup", (event) => {
  if (!photoSwipeStart || !event.target.closest(".photo-lightbox")) return;
  const distanceX = event.clientX - photoSwipeStart.x;
  const distanceY = event.clientY - photoSwipeStart.y;
  photoSwipeStart = null;
  if (Math.abs(distanceX) > 48 && Math.abs(distanceX) > Math.abs(distanceY)) {
    changePhoto(distanceX > 0 ? -1 : 1);
  }
});

app.addEventListener("pointercancel", () => {
  photoSwipeStart = null;
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (state.phase === "photos" && state.photoOpen) {
      state.photoOpen = false;
      render();
    } else if (!["locked", "opening", "hub"].includes(state.phase)) {
      openModule("hub");
    }
  } else if (
    state.phase === "photos" &&
    state.photoOpen &&
    event.key === "ArrowRight"
  ) {
    changePhoto(1);
  } else if (
    state.phase === "photos" &&
    state.photoOpen &&
    event.key === "ArrowLeft"
  ) {
    changePhoto(-1);
  }
});

audio.addEventListener("play", () => {
  state.isPlaying = true;
  syncPlaybackUi();
});
audio.addEventListener("pause", () => {
  state.isPlaying = false;
  syncPlaybackUi();
});
audio.addEventListener("timeupdate", () => {
  state.currentTime = audio.currentTime;
  syncProgressUi();
});
audio.addEventListener("loadedmetadata", () => {
  state.duration = audio.duration;
  syncProgressUi();
});
audio.addEventListener("ended", () => {
  if (state.repeatOne) {
    state.currentTime = 0;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    playSong((state.activeSong + 1) % state.gift.songs.length);
  }
});

function initParticleHeart(canvas, mode = "heart") {
  if (!canvas) return () => {};
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let seed = 220819;
  const transitionStartedAt = performance.now();
  const particleCount = 3200;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const particles = Array.from({ length: particleCount }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const layer = random();
    const onShell = layer < 0.42;
    const isAura = layer > 0.96;
    const radius = isAura
      ? 1.03 + random() * 0.13
      : onShell
        ? 0.9 + random() * 0.12
        : Math.sqrt(random()) * 0.96;
    const sin = Math.sin(angle);
    return {
      x: 16 * sin * sin * sin * radius,
      y:
        -(
          13 * Math.cos(angle) -
          5 * Math.cos(angle * 2) -
          2 * Math.cos(angle * 3) -
          Math.cos(angle * 4)
        ) * radius,
      z: (random() - 0.5) * (9.4 - Math.min(radius, 1) * 3.1),
      size: (isAura ? 0.42 : 0.58) + random() * (onShell ? 1.95 : 1.55),
      twinkle: random() * Math.PI * 2,
      drift: random() * Math.PI * 2,
      hue: 326 + random() * 27,
      speed: 0.7 + random() * 1.4,
      onShell,
      isAura,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      index,
    };
  });

  const buildTextTargets = () => {
    const textCanvas = document.createElement("canvas");
    textCanvas.width = Math.max(1, Math.round(width));
    textCanvas.height = Math.max(1, Math.round(height));
    const textContext = textCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!textContext) return;
    const compact = width < 620;
    const lines = (
      compact ? ["Mãi thương em", "Hồng Châu"] : ["Mãi thương em Hồng Châu"]
    ).map((line) => line.normalize("NFD"));
    let fontSize = compact
      ? Math.min(58, width * 0.135)
      : Math.min(82, width * 0.082);
    const setFont = () => {
      textContext.font = `italic 700 ${fontSize}px "Segoe UI", Arial, sans-serif`;
    };
    setFont();
    const widestLine = () =>
      Math.max(...lines.map((line) => textContext.measureText(line).width));
    while (widestLine() > width * 0.86 && fontSize > 22) {
      fontSize -= 1;
      setFont();
    }
    const lineHeight = fontSize * 1.08;
    const firstBaseline =
      height / 2 - ((lines.length - 1) * lineHeight) / 2 + fontSize * 0.34;
    textContext.fillStyle = "#fff";
    textContext.textAlign = "center";
    textContext.textBaseline = "middle";
    lines.forEach((line, index) =>
      textContext.fillText(line, width / 2, firstBaseline + index * lineHeight),
    );
    const pixels = textContext.getImageData(
      0,
      0,
      textCanvas.width,
      textCanvas.height,
    ).data;
    const step = compact ? 2 : 3;
    const targets = [];
    for (let y = 0; y < textCanvas.height; y += step) {
      for (let x = 0; x < textCanvas.width; x += step) {
        if (pixels[(y * textCanvas.width + x) * 4 + 3] > 80)
          targets.push({ x, y });
      }
    }
    if (!targets.length) return;
    particles.forEach((particle, index) => {
      const target = targets[(index * 9973) % targets.length];
      const jitter = index >= targets.length ? ((index % 3) - 1) * 0.42 : 0;
      particle.targetX = target.x + jitter;
      particle.targetY = target.y - jitter;
      particle.targetZ =
        Math.sin((target.x / Math.max(width, 1)) * Math.PI * 3.2) * 10 +
        ((index % 11) - 5) * 0.32;
    });
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildTextTargets();
  };

  const draw = (now) => {
    const time = now / 1000;
    const transitionAge = (now - transitionStartedAt) / 1000;
    const transitionProgress = Math.max(
      0,
      Math.min(1, (transitionAge - 0.12) / 1.65),
    );
    const transitionWave =
      (mode === "to-text" || mode === "to-heart") && transitionAge < 1.15
        ? Math.sin(Math.min(1, transitionAge / 1.15) * Math.PI)
        : 0;
    const morphRaw =
      mode === "text"
        ? 1
        : mode === "to-text"
          ? transitionProgress
          : mode === "to-heart"
            ? 1 - transitionProgress
            : 0;
    const morph = morphRaw * morphRaw * (3 - 2 * morphRaw);
    const scale =
      Math.min(width / 38, height / 33.5) * (1 + Math.sin(time * 2.25) * 0.022);
    const rotationY = Math.sin(time * 0.47) * 0.46 * (1 - morph);
    const rotationX = Math.sin(time * 0.32) * 0.14 * (1 - morph);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const textRotationY = Math.sin(time * 0.42) * 0.13;
    const textRotationX = Math.sin(time * 0.31 + 0.7) * 0.055;
    const textCosY = Math.cos(textRotationY);
    const textSinY = Math.sin(textRotationY);
    const textCosX = Math.cos(textRotationX);
    const textSinX = Math.sin(textRotationX);
    const textFloatX = Math.sin(time * 0.52) * Math.min(7, width * 0.008);
    const textFloatY = Math.cos(time * 0.43) * Math.min(6, height * 0.009);

    context.clearRect(0, 0, width, height);
    const glowRadius = morph
      ? Math.min(width * 0.48, height * 0.34)
      : Math.min(width, height) * 0.43;
    const glow = context.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      glowRadius,
    );
    glow.addColorStop(
      0,
      `rgba(255, 40, 119, ${0.15 + Math.sin(time * 1.9) * 0.03})`,
    );
    glow.addColorStop(0.5, "rgba(202, 23, 92, 0.045)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    for (const particle of particles) {
      const wobble = Math.sin(time * particle.speed + particle.drift) * 0.12;
      const x1 = particle.x * cosY - particle.z * sinY;
      const z1 = particle.x * sinY + particle.z * cosY;
      const y1 = particle.y * cosX - z1 * sinX;
      const z2 = particle.y * sinX + z1 * cosX;
      const distance =
        Math.sqrt(particle.x * particle.x + particle.y * particle.y) || 1;
      const explode = transitionWave * (5.2 + (particle.index % 13) * 0.48);
      const perspective = 1.18 / (1.18 + (z2 + 9) / 48);
      const heartX =
        width / 2 +
        (x1 + (particle.x / distance) * explode + wobble) * scale * perspective;
      const heartY =
        height / 2 +
        (y1 + (particle.y / distance) * explode + wobble * 0.45) *
          scale *
          perspective;
      const targetLocalX = particle.targetX - width / 2;
      const targetLocalY = particle.targetY - height / 2;
      const targetWobble =
        Math.sin(time * particle.speed * 0.48 + particle.drift) * 0.85;
      const targetX1 = targetLocalX * textCosY - particle.targetZ * textSinY;
      const targetZ1 = targetLocalX * textSinY + particle.targetZ * textCosY;
      const targetY1 = targetLocalY * textCosX - targetZ1 * textSinX;
      const targetZ2 = targetLocalY * textSinX + targetZ1 * textCosX;
      const textPerspective = 1.04 / (1.04 + targetZ2 / 520);
      const textX =
        width / 2 + targetX1 * textPerspective + textFloatX + targetWobble;
      const textY =
        height / 2 +
        targetY1 * textPerspective +
        textFloatY +
        Math.cos(time * particle.speed * 0.4 + particle.drift) * 0.52;
      const scatterAngle = particle.drift + particle.index * 0.017;
      const scatter = transitionWave * (4 + (particle.index % 17) * 0.46);
      const screenX =
        heartX + (textX - heartX) * morph + Math.cos(scatterAngle) * scatter;
      const screenY =
        heartY + (textY - heartY) * morph + Math.sin(scatterAngle) * scatter;
      const twinkle = 0.54 + Math.sin(time * 3.4 + particle.twinkle) * 0.26;
      const pointSize = Math.max(
        0.72,
        particle.size *
          (perspective * (1 - morph) + textPerspective * morph) *
          (1 + transitionWave * 0.35 + morph * 0.08),
      );
      const lightness =
        59 +
        Math.max(-9, Math.min(15, z2 * 1.7)) * (1 - morph) +
        twinkle * 14 +
        morph * 7;
      const alpha = particle.isAura
        ? 0.34
        : particle.onShell
          ? 0.78
          : Math.max(0.28, twinkle);
      context.fillStyle = `hsla(${particle.hue}, 98%, ${lightness}%, ${alpha + morph * (0.95 - alpha)})`;
      if (particle.index % 23 === 0) {
        context.shadowColor = "rgba(255, 38, 119, .92)";
        context.shadowBlur = 10 + morph * 2;
      } else {
        context.shadowBlur = 0;
      }
      context.fillRect(
        screenX,
        screenY,
        pointSize,
        pointSize * (0.8 + (particle.index % 4) * 0.13),
      );
    }

    context.globalCompositeOperation = "source-over";
    context.shadowBlur = 0;
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  animationFrame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
  };
}

render();
