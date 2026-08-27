const app = document.querySelector('#app');
const audio = document.querySelector('#gift-audio');

const DEMO_PHOTOS = [
  {
    id: 'sunset-embrace',
    photoUrl: 'https://images.unsplash.com/photo-1738748707927-6a8edb6ba32a?auto=format&fit=crop&w=1400&q=86',
    caption: 'Có những khoảnh khắc chỉ cần nhớ lại thôi cũng đủ mỉm cười.',
  },
  {
    id: 'spring-lover',
    photoUrl: 'https://images.unsplash.com/photo-1523832083691-c772f31be296?auto=format&fit=crop&w=1400&q=86',
    caption: 'Cảm ơn bạn vì đã làm những ngày bình thường trở nên thật đặc biệt.',
  },
  {
    id: 'beach-silhouette',
    photoUrl: 'https://images.unsplash.com/photo-1594768289642-35c05c10039c?auto=format&fit=crop&w=1400&q=86',
    caption: 'Mong chúng mình sẽ còn đi cùng nhau qua thật nhiều buổi chiều như thế.',
  },
  {
    id: 'little-flower',
    photoUrl: 'https://images.unsplash.com/photo-1667731976090-e274235f8280?auto=format&fit=crop&w=1400&q=86',
    caption: 'Một chút dịu dàng, gửi riêng đến người đang xem món quà này.',
  },
  {
    id: 'golden-flowers',
    photoUrl: 'https://images.unsplash.com/photo-1746592176452-35a6b0e51f22?auto=format&fit=crop&w=1400&q=86',
    caption: 'Dù hôm nay thế nào, bạn vẫn luôn xứng đáng với những điều đẹp nhất.',
  },
  {
    id: 'quiet-shore',
    photoUrl: 'https://images.unsplash.com/photo-1562056114-fb07b52a5070?auto=format&fit=crop&w=1400&q=86',
    caption: 'Và đây chưa phải là kỷ niệm cuối cùng của chúng mình đâu nhé.',
  },
];

const DEMO_SONGS = [
  { id: 'song-1', title: 'Gửi người mình thương', artist: 'Bài hát đầu tiên', songUrl: null, coverUrl: DEMO_PHOTOS[0].photoUrl },
  { id: 'song-2', title: 'Ngày mình gặp nhau', artist: 'Một kỷ niệm thật đẹp', songUrl: null, coverUrl: DEMO_PHOTOS[1].photoUrl },
  { id: 'song-3', title: 'Đi cùng nhau nhé', artist: 'Cho những ngày sau này', songUrl: null, coverUrl: DEMO_PHOTOS[2].photoUrl },
  { id: 'song-4', title: 'Chỉ cần có bạn', artist: 'Bản nhạc cuối trong list', songUrl: null, coverUrl: DEMO_PHOTOS[4].photoUrl },
];

const DEMO_GIFT = {
  title: 'Những điều mình muốn giữ lại',
  photos: DEMO_PHOTOS,
  songs: DEMO_SONGS,
  letter: [
    'Gửi bạn — người đã khiến rất nhiều ngày bình thường của mình trở nên đặc biệt.',
    'Mình không biết phải gom hết những điều muốn nói vào đâu, nên đã cất chúng trong góc nhỏ này: vài bài hát, vài tấm ảnh và những kỷ niệm mà mình luôn muốn giữ thật lâu.',
    'Cảm ơn bạn vì đã xuất hiện, đã lắng nghe và đã ở bên. Mong những ngày sắp tới của bạn luôn dịu dàng, rực rỡ và có thật nhiều lý do để mỉm cười.',
    'Dù món quà này nhỏ thôi, tình cảm đặt vào trong đó thì không nhỏ chút nào đâu.',
  ],
  giftMessage: 'Trái tim này không phải món quà cuối cùng — nó là lời hứa rằng mình sẽ còn cùng bạn tạo thêm thật nhiều kỷ niệm mới.',
};

const CONFIG = Object.freeze({
  supabaseUrl: import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  defaultGiftId: import.meta.env.NEXT_PUBLIC_GIFT_ID || import.meta.env.VITE_GIFT_ID || '',
  passcode: String(import.meta.env.NEXT_PUBLIC_GIFT_PASSCODE || import.meta.env.VITE_GIFT_PASSCODE || '2208'),
});

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
const PETALS = Array.from({ length: 24 }, (_, index) => ({
  left: (index * 37 + 9) % 100,
  delay: ((index * 13) % 31) / 10,
  duration: 2.8 + ((index * 17) % 21) / 10,
  size: 14 + ((index * 11) % 17),
  symbol: ['✿', '♡', '✦', '❀'][index % 4],
}));

const state = {
  gift: DEMO_GIFT,
  phase: 'locked',
  pin: '',
  message: '',
  photoIndex: 0,
  photoOpen: false,
  activeSong: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  heartOpened: false,
  isDemo: true,
  loading: true,
};

let openingTimer = null;
let touchStart = null;
let destroyHeart = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function currentSong() {
  return state.gift.songs[state.activeSong] || state.gift.songs[0];
}

function resolveGiftId() {
  const queryId = new URLSearchParams(window.location.search).get('gift');
  const routeMatch = window.location.pathname.match(/^\/gift\/([^/]+)/);
  return queryId || (routeMatch ? decodeURIComponent(routeMatch[1]) : '') || CONFIG.defaultGiftId;
}

async function fetchTable(table, parameters) {
  const baseUrl = CONFIG.supabaseUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/rest/v1/${table}?${parameters}`, {
    headers: {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${CONFIG.supabaseAnonKey}`,
    },
  });
  if (!response.ok) throw new Error(`Không thể tải bảng ${table}`);
  return response.json();
}

async function loadGift() {
  const giftId = resolveGiftId();
  const configured = CONFIG.supabaseUrl.startsWith('http') && CONFIG.supabaseAnonKey && giftId;

  if (configured) {
    try {
      const encodedId = encodeURIComponent(giftId);
      const [gifts, photosData, songsData] = await Promise.all([
        fetchTable('gifts', `select=id,title,song_url&id=eq.${encodedId}&limit=1`),
        fetchTable('gift_photos', `select=id,photo_url,caption,order_index&gift_id=eq.${encodedId}&order=order_index.asc`),
        fetchTable('gift_songs', `select=id,title,artist,song_url,cover_url,order_index&gift_id=eq.${encodedId}&order=order_index.asc`),
      ]);

      if (gifts[0] && photosData.length) {
        const photos = photosData.map((photo) => ({
          id: photo.id,
          photoUrl: photo.photo_url,
          caption: photo.caption || 'Một khoảnh khắc thật đẹp của chúng mình.',
        }));

        let songs = DEMO_SONGS;
        if (songsData.length) {
          songs = songsData.map((song, index) => ({
            id: song.id,
            title: song.title || `Bài hát ${index + 1}`,
            artist: song.artist || 'Dành riêng cho bạn',
            songUrl: song.song_url,
            coverUrl: song.cover_url || photos[index % photos.length].photoUrl,
          }));
        } else if (gifts[0].song_url) {
          songs = [{
            id: 'legacy-song',
            title: 'Bài hát của chúng mình',
            artist: 'Dành riêng cho bạn',
            songUrl: gifts[0].song_url,
            coverUrl: photos[0].photoUrl,
          }];
        }

        state.gift = {
          ...DEMO_GIFT,
          title: gifts[0].title || DEMO_GIFT.title,
          photos,
          songs,
        };
        state.isDemo = false;
      }
    } catch {
      state.message = '';
    }
  }

  state.loading = false;
  render();
}

function renderLock() {
  const dots = Array.from({ length: CONFIG.passcode.length }, (_, index) =>
    `<span class="${index < state.pin.length ? 'filled' : ''}"></span>`
  ).join('');
  const keypad = KEYS.map((key) => {
    const secondary = key === 'clear' || key === 'back';
    const label = key === 'clear' ? 'Xóa hết' : key === 'back' ? 'Xóa một số' : `Số ${key}`;
    const text = key === 'clear' ? 'C' : key === 'back' ? '⌫' : key;
    return `<button type="button" class="key${secondary ? ' key-secondary' : ''}" data-action="key" data-key="${key}" aria-label="${label}">${text}</button>`;
  }).join('');

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
        <p class="intro">Nhập ${CONFIG.passcode.length} con số đặc biệt để xem điều đang chờ bạn ở bên trong.</p>
        <div class="pin-dots" aria-label="Đã nhập ${state.pin.length} trên ${CONFIG.passcode.length} số">${dots}</div>
        <div class="keypad" aria-label="Bàn phím nhập mã">${keypad}</div>
        <button class="unlock-button" data-action="unlock" ${state.pin.length !== CONFIG.passcode.length ? 'disabled' : ''}>
          <span>Mở quà</span><span aria-hidden="true">→</span>
        </button>
        <p class="hint">Gợi ý: một ngày rất đặc biệt${state.isDemo ? ' · Mã xem thử: 2208' : ''}</p>
        <p class="status" role="status" aria-live="polite">${escapeHtml(state.message)}</p>
      </div>
      <p class="signature">made with <span>♥</span> for someone special</p>
    </section>
  `;
}

function renderOpening() {
  const petals = PETALS.map((petal) =>
    `<span class="petal" style="--petal-x:${petal.left}vw;--petal-delay:${petal.delay}s;--petal-duration:${petal.duration}s;--petal-size:${petal.size}px">${petal.symbol}</span>`
  ).join('');
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
          <span class="module-number">01</span><span class="module-icon ${state.isPlaying ? 'music-playing' : ''}">♫</span>
          <span class="module-copy"><strong>Danh sách nhạc</strong><small>${state.gift.songs.length} bài hát của chúng mình</small></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-photos" data-action="module" data-module="photos">
          <span class="module-number">02</span><span class="module-icon">▣</span>
          <span class="module-copy"><strong>Danh sách ảnh</strong><small>${state.gift.photos.length} khoảnh khắc được giữ lại</small></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-letter" data-action="module" data-module="letter">
          <span class="module-number">03</span><span class="module-icon">✉</span>
          <span class="module-copy"><strong>Một lá thư</strong><small>Những điều mình muốn nói</small></span><span class="module-arrow">↗</span>
        </button>
        <button class="hub-module module-gift" data-action="module" data-module="heart">
          <span class="module-number">04</span><span class="module-icon heart-icon">♥</span>
          <span class="module-copy"><strong>Món quà bí mật</strong><small>Chạm vào trái tim này nhé</small></span><span class="module-arrow">↗</span>
        </button>
      </div>
      <p class="hub-signature">4 điều nhỏ · dành cho một người thật đặc biệt</p>
    </section>
  `;
}

function renderTopbar(eyebrow, title, count, extraClass = '') {
  return `
    <header class="module-topbar ${extraClass}">
      <button class="back-button" data-action="back"><span>←</span> Quay lại</button>
      <div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>
      <span class="module-count">${count}</span>
    </header>
  `;
}

function renderMusic() {
  const song = currentSong();
  const rows = state.gift.songs.map((item, index) => `
    <button class="song-row ${index === state.activeSong ? 'active' : ''}" data-action="play-song" data-index="${index}">
      <span class="song-index">${index === state.activeSong && state.isPlaying ? '♫' : String(index + 1).padStart(2, '0')}</span>
      <img src="${escapeHtml(item.coverUrl)}" alt="" />
      <span class="song-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.artist)}</small></span>
      <span class="song-action">${item.songUrl ? '▶' : '· · ·'}</span>
    </button>
  `).join('');

  return `
    <section class="module-screen music-screen">
      ${renderTopbar('Our soundtrack', 'Danh sách nhạc', `${String(state.gift.songs.length).padStart(2, '0')} bài`)}
      <div class="music-layout">
        <div class="now-playing-card">
          <div class="vinyl-cover ${state.isPlaying ? 'spinning' : ''}">
            <img src="${escapeHtml(song.coverUrl)}" alt="Ảnh bìa bài hát" /><span class="vinyl-center"></span>
          </div>
          <div class="now-playing-copy"><p>Đang phát</p><h3>${escapeHtml(song.title)}</h3><span>${escapeHtml(song.artist)}</span></div>
          <input id="song-progress" class="song-progress" type="range" min="0" max="${state.duration || 0}" value="${Math.min(state.currentTime, state.duration || 0)}" aria-label="Tiến độ bài hát" />
          <div class="song-time"><span id="current-time">${formatTime(state.currentTime)}</span><span id="duration-time">${formatTime(state.duration)}</span></div>
          <div class="player-controls">
            <button data-action="previous-song" aria-label="Bài trước">‹</button>
            <button class="play-button" data-action="toggle-music" aria-label="${state.isPlaying ? 'Tạm dừng' : 'Phát'}">${state.isPlaying ? 'Ⅱ' : '▶'}</button>
            <button data-action="next-song" aria-label="Bài tiếp">›</button>
          </div>
        </div>
        <div class="playlist-card">
          <div class="playlist-heading"><span>Playlist dành riêng cho bạn</span><small>♡</small></div>
          <div class="song-list">${rows}</div>
          <p class="playlist-message" role="status">${escapeHtml(state.message)}</p>
        </div>
      </div>
    </section>
  `;
}

function renderPhotos() {
  const tiles = state.gift.photos.map((photo, index) => `
    <button class="photo-tile tile-${index % 5}" data-action="open-photo" data-index="${index}">
      <img src="${escapeHtml(photo.photoUrl)}" alt="${escapeHtml(photo.caption)}" />
      <span class="tile-overlay"><small>${String(index + 1).padStart(2, '0')}</small><strong>${escapeHtml(photo.caption)}</strong></span>
    </button>
  `).join('');

  const activePhoto = state.gift.photos[state.photoIndex];
  const lightbox = state.photoOpen ? `
    <div class="photo-lightbox">
      <button class="lightbox-close" data-action="close-photo" aria-label="Đóng ảnh">×</button>
      <button class="nav-button" data-action="previous-photo" aria-label="Ảnh trước">‹</button>
      <article class="photo-card">
        <div class="photo-frame">
          <img src="${escapeHtml(activePhoto.photoUrl)}" alt="${escapeHtml(activePhoto.caption)}" />
          <span class="photo-number">${String(state.photoIndex + 1).padStart(2, '0')}</span>
        </div>
        <div class="caption-row"><span class="caption-heart">♡</span><p>${escapeHtml(activePhoto.caption)}</p></div>
      </article>
      <button class="nav-button" data-action="next-photo" aria-label="Ảnh tiếp theo">›</button>
    </div>
  ` : '';

  return `
    <section class="module-screen photo-list-screen">
      ${renderTopbar('Our little archive', 'Danh sách ảnh', `${String(state.gift.photos.length).padStart(2, '0')} ảnh`)}
      <div class="photo-list-grid">${tiles}</div>
      ${lightbox}
    </section>
  `;
}

function renderLetter() {
  const paragraphs = state.gift.letter.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  return `
    <section class="module-screen letter-screen">
      ${renderTopbar('Words from my heart', 'Một lá thư', '03', 'letter-topbar')}
      <div class="letter-wrap">
        <div class="envelope-back" aria-hidden="true"><span>♥</span></div>
        <article class="letter-paper">
          <div class="letter-date">22 · 08 · 2026</div>
          <p class="letter-greeting">Gửi người đặc biệt,</p>
          ${paragraphs}
          <div class="letter-signoff"><span>Thương gửi,</span><strong>Một người luôn trân trọng bạn ♡</strong></div>
        </article>
      </div>
    </section>
  `;
}

function renderHeart() {
  return `
    <section class="dark-heart-screen ${state.heartOpened ? 'opened' : ''}">
      <button class="dark-back-button" data-action="back"><span>←</span> Quay lại</button>
      <p class="dark-heart-kicker">THE SECRET GIFT · 04</p>
      <div class="particle-heart-wrap">
        <canvas class="particle-heart-canvas" aria-hidden="true"></canvas>
        <button class="particle-heart-hit" data-action="open-heart" aria-label="Chạm để mở trái tim hạt phát sáng" ${state.heartOpened ? 'disabled' : ''}></button>
      </div>
      ${state.heartOpened ? '' : '<div class="heart-tap-copy"><strong>Chạm vào trái tim</strong><span>để mở món quà cuối cùng</span></div>'}
      <p class="heart-live-copy" aria-live="polite">${state.heartOpened ? 'Mãi thương em Hồng Châu' : ''}</p>
      ${state.heartOpened ? '<button class="heart-reset-button" data-action="reset-heart"><span>↻</span> Xem lại trái tim</button>' : ''}
      <button class="dark-music-button" data-action="toggle-music" aria-label="${state.isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}">${state.isPlaying ? '♫' : '♪'}</button>
      <div class="heart-stars" aria-hidden="true">✦　·　✧　·　✦</div>
    </section>
  `;
}

function render() {
  if (destroyHeart) {
    destroyHeart();
    destroyHeart = null;
  }

  if (state.loading) {
    app.className = 'loading-screen';
    app.innerHTML = '<span class="loading-heart">♡</span><p>Đang chuẩn bị một điều thật đẹp…</p>';
    return;
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

  if (state.phase === 'heart') {
    requestAnimationFrame(() => {
      destroyHeart = initParticleHeart(document.querySelector('.particle-heart-canvas'), state.heartOpened);
    });
  }
}

function openModule(phase) {
  state.message = '';
  state.photoOpen = false;
  state.phase = phase;
  if (phase === 'heart') state.heartOpened = false;
  render();
}

function pressKey(key) {
  state.message = '';
  if (key === 'clear') state.pin = '';
  else if (key === 'back') state.pin = state.pin.slice(0, -1);
  else if (state.pin.length < CONFIG.passcode.length) state.pin += key;
  render();
}

function unlock() {
  if (state.pin !== CONFIG.passcode) {
    state.message = 'Chưa đúng rồi, thử lại nhé ♡';
    state.pin = '';
    render();
    return;
  }

  const song = currentSong();
  if (song && song.songUrl) {
    audio.src = song.songUrl;
    audio.play().catch(() => {});
  }
  state.message = '';
  state.phase = 'opening';
  render();
  clearTimeout(openingTimer);
  openingTimer = setTimeout(() => {
    state.phase = 'hub';
    render();
  }, 1850);
}

function playSong(index) {
  const song = state.gift.songs[index];
  state.activeSong = index;
  state.message = '';
  state.currentTime = 0;
  state.duration = 0;

  if (!song || !song.songUrl) {
    audio.pause();
    state.isPlaying = false;
    state.message = 'Bài này đang là dữ liệu mẫu. Thêm song_url trong Supabase để phát nhạc nhé.';
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
  const song = currentSong();
  if (!song || !song.songUrl) {
    state.message = 'Thêm danh sách nhạc vào Supabase để bật trình phát.';
    if (state.phase === 'music') render();
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
  document.querySelector('.vinyl-cover')?.classList.toggle('spinning', state.isPlaying);
  const playButton = document.querySelector('.play-button');
  if (playButton) {
    playButton.textContent = state.isPlaying ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', state.isPlaying ? 'Tạm dừng' : 'Phát');
  }
  const musicButton = document.querySelector('.dark-music-button');
  if (musicButton) {
    musicButton.textContent = state.isPlaying ? '♫' : '♪';
    musicButton.setAttribute('aria-label', state.isPlaying ? 'Tắt nhạc' : 'Bật nhạc');
  }
}

function syncProgressUi() {
  const progress = document.querySelector('#song-progress');
  const current = document.querySelector('#current-time');
  const duration = document.querySelector('#duration-time');
  if (progress) {
    progress.max = state.duration || 0;
    progress.value = Math.min(state.currentTime, state.duration || 0);
  }
  if (current) current.textContent = formatTime(state.currentTime);
  if (duration) duration.textContent = formatTime(state.duration);
}

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'key') pressKey(button.dataset.key);
  else if (action === 'unlock') unlock();
  else if (action === 'module') openModule(button.dataset.module);
  else if (action === 'back') openModule('hub');
  else if (action === 'play-song') playSong(Number(button.dataset.index));
  else if (action === 'toggle-music') toggleMusic();
  else if (action === 'previous-song') playSong((state.activeSong - 1 + state.gift.songs.length) % state.gift.songs.length);
  else if (action === 'next-song') playSong((state.activeSong + 1) % state.gift.songs.length);
  else if (action === 'open-photo') {
    state.photoIndex = Number(button.dataset.index);
    state.photoOpen = true;
    render();
  } else if (action === 'close-photo') {
    state.photoOpen = false;
    render();
  } else if (action === 'previous-photo') changePhoto(-1);
  else if (action === 'next-photo') changePhoto(1);
  else if (action === 'open-heart') {
    state.heartOpened = true;
    render();
  } else if (action === 'reset-heart') {
    state.heartOpened = false;
    render();
  }
});

app.addEventListener('input', (event) => {
  if (event.target.matches('#song-progress')) {
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    state.currentTime = nextTime;
    syncProgressUi();
  }
});

app.addEventListener('touchstart', (event) => {
  if (event.target.closest('.photo-lightbox')) touchStart = event.touches[0].clientX;
}, { passive: true });

app.addEventListener('touchend', (event) => {
  if (touchStart === null || !event.target.closest('.photo-lightbox')) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 48) changePhoto(distance > 0 ? -1 : 1);
  touchStart = null;
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (state.phase === 'photos' && state.photoOpen) {
      state.photoOpen = false;
      render();
    } else if (!['locked', 'opening', 'hub'].includes(state.phase)) {
      openModule('hub');
    }
  } else if (state.phase === 'photos' && state.photoOpen && event.key === 'ArrowRight') {
    changePhoto(1);
  } else if (state.phase === 'photos' && state.photoOpen && event.key === 'ArrowLeft') {
    changePhoto(-1);
  }
});

audio.addEventListener('play', () => {
  state.isPlaying = true;
  syncPlaybackUi();
});
audio.addEventListener('pause', () => {
  state.isPlaying = false;
  syncPlaybackUi();
});
audio.addEventListener('timeupdate', () => {
  state.currentTime = audio.currentTime;
  syncProgressUi();
});
audio.addEventListener('loadedmetadata', () => {
  state.duration = audio.duration;
  syncProgressUi();
});
audio.addEventListener('ended', () => {
  playSong((state.activeSong + 1) % state.gift.songs.length);
});

function initParticleHeart(canvas, burst) {
  if (!canvas) return () => {};
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let seed = 220819;
  const burstStartedAt = performance.now();
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
    const radius = isAura ? 1.03 + random() * 0.13 : onShell ? 0.9 + random() * 0.12 : Math.sqrt(random()) * 0.96;
    const sin = Math.sin(angle);
    return {
      x: 16 * sin * sin * sin * radius,
      y: -(13 * Math.cos(angle) - 5 * Math.cos(angle * 2) - 2 * Math.cos(angle * 3) - Math.cos(angle * 4)) * radius,
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
      index,
    };
  });

  const buildTextTargets = () => {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = Math.max(1, Math.round(width));
    textCanvas.height = Math.max(1, Math.round(height));
    const textContext = textCanvas.getContext('2d', { willReadFrequently: true });
    if (!textContext) return;
    const compact = width < 620;
    const lines = compact ? ['Mãi thương em', 'Hồng Châu'] : ['Mãi thương em Hồng Châu'];
    let fontSize = compact ? Math.min(58, width * 0.135) : Math.min(82, width * 0.082);
    const setFont = () => {
      textContext.font = `italic 700 ${fontSize}px Georgia, serif`;
    };
    setFont();
    const widestLine = () => Math.max(...lines.map((line) => textContext.measureText(line).width));
    while (widestLine() > width * 0.86 && fontSize > 22) {
      fontSize -= 1;
      setFont();
    }
    const lineHeight = fontSize * 1.08;
    const firstBaseline = height / 2 - ((lines.length - 1) * lineHeight) / 2 + fontSize * 0.34;
    textContext.fillStyle = '#fff';
    textContext.textAlign = 'center';
    textContext.textBaseline = 'middle';
    lines.forEach((line, index) => textContext.fillText(line, width / 2, firstBaseline + index * lineHeight));
    const pixels = textContext.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
    const step = compact ? 2 : 3;
    const targets = [];
    for (let y = 0; y < textCanvas.height; y += step) {
      for (let x = 0; x < textCanvas.width; x += step) {
        if (pixels[(y * textCanvas.width + x) * 4 + 3] > 80) targets.push({ x, y });
      }
    }
    if (!targets.length) return;
    particles.forEach((particle, index) => {
      const target = targets[(index * 9973) % targets.length];
      const jitter = index >= targets.length ? ((index % 3) - 1) * 0.42 : 0;
      particle.targetX = target.x + jitter;
      particle.targetY = target.y - jitter;
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
    const burstAge = (now - burstStartedAt) / 1000;
    const burstPower = burst && burstAge < 0.92 ? Math.sin(Math.min(1, burstAge / 0.92) * Math.PI) : 0;
    const morphRaw = burst ? Math.max(0, Math.min(1, (burstAge - 0.38) / 1.42)) : 0;
    const morph = morphRaw * morphRaw * (3 - 2 * morphRaw);
    const scale = Math.min(width / 38, height / 33.5) * (1 + Math.sin(time * 2.25) * 0.022);
    const rotationY = Math.sin(time * 0.47) * 0.46 * (1 - morph);
    const rotationX = Math.sin(time * 0.32) * 0.14 * (1 - morph);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    context.clearRect(0, 0, width, height);
    const glowRadius = morph ? Math.min(width * 0.48, height * 0.34) : Math.min(width, height) * 0.43;
    const glow = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, glowRadius);
    glow.addColorStop(0, `rgba(255, 40, 119, ${0.15 + Math.sin(time * 1.9) * 0.03})`);
    glow.addColorStop(0.5, 'rgba(202, 23, 92, 0.045)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';

    for (const particle of particles) {
      const wobble = Math.sin(time * particle.speed + particle.drift) * 0.12;
      const x1 = particle.x * cosY - particle.z * sinY;
      const z1 = particle.x * sinY + particle.z * cosY;
      const y1 = particle.y * cosX - z1 * sinX;
      const z2 = particle.y * sinX + z1 * cosX;
      const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y) || 1;
      const explode = burstPower * (5.5 + (particle.index % 13) * 0.52);
      const perspective = 1.18 / (1.18 + (z2 + 9) / 48);
      const heartX = width / 2 + (x1 + (particle.x / distance) * explode + wobble) * scale * perspective;
      const heartY = height / 2 + (y1 + (particle.y / distance) * explode + wobble * 0.45) * scale * perspective;
      const shimmer = Math.sin(time * 1.4 + particle.drift) * 0.28 * morph;
      const screenX = heartX + (particle.targetX + shimmer - heartX) * morph;
      const screenY = heartY + (particle.targetY - shimmer * 0.35 - heartY) * morph;
      const twinkle = 0.54 + Math.sin(time * 3.4 + particle.twinkle) * 0.26;
      const pointSize = Math.max(0.72, particle.size * perspective * (1 + burstPower * 0.35 + morph * 0.08));
      const lightness = 59 + Math.max(-9, Math.min(15, z2 * 1.7)) * (1 - morph) + twinkle * 14 + morph * 7;
      const alpha = particle.isAura ? 0.34 : particle.onShell ? 0.78 : Math.max(0.28, twinkle);
      context.fillStyle = `hsla(${particle.hue}, 98%, ${lightness}%, ${alpha + morph * (0.95 - alpha)})`;
      if (particle.index % 23 === 0) {
        context.shadowColor = 'rgba(255, 38, 119, .92)';
        context.shadowBlur = 10 + morph * 2;
      } else {
        context.shadowBlur = 0;
      }
      context.fillRect(screenX, screenY, pointSize, pointSize * (0.8 + (particle.index % 4) * 0.13));
    }

    context.globalCompositeOperation = 'source-over';
    context.shadowBlur = 0;
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  animationFrame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}

render();
loadGift();
