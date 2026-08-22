'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

type Photo = {
  id: string;
  photoUrl: string;
  caption: string;
};

type Song = {
  id: string;
  title: string;
  artist: string;
  songUrl: string | null;
  coverUrl: string;
};

type Gift = {
  title: string;
  photos: Photo[];
  songs: Song[];
  letter: string[];
  giftMessage: string;
};

type Phase = 'locked' | 'opening' | 'hub' | 'music' | 'photos' | 'letter' | 'heart';

const DEMO_PHOTOS: Photo[] = [
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

const DEMO_SONGS: Song[] = [
  { id: 'song-1', title: 'Gửi người mình thương', artist: 'Bài hát đầu tiên', songUrl: null, coverUrl: DEMO_PHOTOS[0].photoUrl },
  { id: 'song-2', title: 'Ngày mình gặp nhau', artist: 'Một kỷ niệm thật đẹp', songUrl: null, coverUrl: DEMO_PHOTOS[1].photoUrl },
  { id: 'song-3', title: 'Đi cùng nhau nhé', artist: 'Cho những ngày sau này', songUrl: null, coverUrl: DEMO_PHOTOS[2].photoUrl },
  { id: 'song-4', title: 'Chỉ cần có bạn', artist: 'Bản nhạc cuối trong list', songUrl: null, coverUrl: DEMO_PHOTOS[4].photoUrl },
];

const DEMO_GIFT: Gift = {
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

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
const PETALS = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: (index * 37 + 9) % 100,
  delay: ((index * 13) % 31) / 10,
  duration: 2.8 + ((index * 17) % 21) / 10,
  size: 14 + ((index * 11) % 17),
  symbol: ['✿', '♡', '✦', '❀'][index % 4],
}));

function resolveGiftId(giftId?: string) {
  if (giftId) return giftId;
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get('gift') ?? process.env.NEXT_PUBLIC_GIFT_ID;
  }
  return process.env.NEXT_PUBLIC_GIFT_ID;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function ParticleHeartCanvas({ burst }: { burst: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let seed = 220819;
    const burstStartedAt = performance.now();

    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const particles = Array.from({ length: 1900 }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const onShell = random() < 0.64;
      const radius = onShell ? 0.82 + random() * 0.2 : Math.sqrt(random()) * 0.88;
      const sin = Math.sin(angle);
      const x = 16 * sin * sin * sin * radius;
      const y = -(13 * Math.cos(angle) - 5 * Math.cos(angle * 2) - 2 * Math.cos(angle * 3) - Math.cos(angle * 4)) * radius;
      const z = (random() - 0.5) * (7.5 - radius * 2.8);

      return {
        x,
        y,
        z,
        size: 0.55 + random() * 1.75,
        twinkle: random() * Math.PI * 2,
        drift: random() * Math.PI * 2,
        hue: 329 + random() * 24,
        speed: 0.7 + random() * 1.4,
        index,
      };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = (now: number) => {
      const time = now / 1000;
      const burstAge = (now - burstStartedAt) / 1000;
      const burstPower = burst && burstAge < 1.25 ? Math.sin(Math.min(1, burstAge / 1.25) * Math.PI) : 0;
      const scale = Math.min(width / 41, height / 37) * (1 + Math.sin(time * 2.25) * 0.018);
      const rotationY = Math.sin(time * 0.47) * 0.42;
      const rotationX = Math.sin(time * 0.32) * 0.12;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.39);
      glow.addColorStop(0, `rgba(255, 40, 119, ${0.12 + Math.sin(time * 1.9) * 0.025})`);
      glow.addColorStop(0.5, 'rgba(202, 23, 92, 0.035)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const wobble = Math.sin(time * particle.speed + particle.drift) * 0.12;
        const x1 = particle.x * cosY - particle.z * sinY;
        const z1 = particle.x * sinY + particle.z * cosY;
        const y1 = particle.y * cosX - z1 * sinX;
        const z2 = particle.y * sinX + z1 * cosX;
        const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y) || 1;
        const explode = burstPower * (8 + (particle.index % 13) * 0.75);
        const perspective = 1.18 / (1.18 + (z2 + 9) / 48);
        const screenX = width / 2 + (x1 + (particle.x / distance) * explode + wobble) * scale * perspective;
        const screenY = height / 2 + (y1 + (particle.y / distance) * explode + wobble * 0.45) * scale * perspective;
        const twinkle = 0.54 + Math.sin(time * 3.4 + particle.twinkle) * 0.26;
        const pointSize = Math.max(0.7, particle.size * perspective * (1 + burstPower * 0.45));
        const lightness = 57 + Math.max(-9, Math.min(15, z2 * 1.7)) + twinkle * 13;

        context.fillStyle = `hsla(${particle.hue}, 96%, ${lightness}%, ${Math.max(0.18, twinkle)})`;
        if (particle.index % 19 === 0) {
          context.shadowColor = 'rgba(255, 38, 119, .92)';
          context.shadowBlur = 9;
        } else {
          context.shadowBlur = 0;
        }
        context.fillRect(screenX, screenY, pointSize, pointSize * (0.8 + (particle.index % 4) * 0.13));
      }

      context.shadowBlur = 0;
      animationFrame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [burst]);

  return <canvas ref={canvasRef} className="particle-heart-canvas" aria-hidden="true" />;
}

export default function GiftReveal({ giftId }: { giftId?: string }) {
  const [gift, setGift] = useState<Gift>(DEMO_GIFT);
  const [phase, setPhase] = useState<Phase>('locked');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [activeSong, setActiveSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [heartOpened, setHeartOpened] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const photoStageRef = useRef<HTMLDivElement>(null);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<number | null>(null);

  const passcode = process.env.NEXT_PUBLIC_GIFT_PASSCODE ?? '2208';
  const currentSong = gift.songs[activeSong] ?? gift.songs[0];

  useEffect(() => {
    let active = true;

    async function loadGift() {
      const supabase = getSupabaseClient();
      const requestedId = resolveGiftId(giftId);

      if (!supabase || !requestedId) {
        if (active) setIsLoading(false);
        return;
      }

      const [giftResult, photoResult, songResult] = await Promise.all([
        supabase.from('gifts').select('id,title,song_url').eq('id', requestedId).single(),
        supabase
          .from('gift_photos')
          .select('id,photo_url,caption,order_index')
          .eq('gift_id', requestedId)
          .order('order_index', { ascending: true }),
        supabase
          .from('gift_songs')
          .select('id,title,artist,song_url,cover_url,order_index')
          .eq('gift_id', requestedId)
          .order('order_index', { ascending: true }),
      ]);

      if (!active) return;

      if (!giftResult.error && !photoResult.error && giftResult.data && photoResult.data?.length) {
        const photos: Photo[] = photoResult.data.map((photo) => ({
          id: photo.id,
          photoUrl: photo.photo_url,
          caption: photo.caption || 'Một khoảnh khắc thật đẹp của chúng mình.',
        }));

        let songs: Song[] = DEMO_SONGS;
        if (!songResult.error && songResult.data?.length) {
          songs = songResult.data.map((song, songIndex) => ({
            id: song.id,
            title: song.title || `Bài hát ${songIndex + 1}`,
            artist: song.artist || 'Dành riêng cho bạn',
            songUrl: song.song_url,
            coverUrl: song.cover_url || photos[songIndex % photos.length].photoUrl,
          }));
        } else if (giftResult.data.song_url) {
          songs = [{
            id: 'legacy-song',
            title: 'Bài hát của chúng mình',
            artist: 'Dành riêng cho bạn',
            songUrl: giftResult.data.song_url,
            coverUrl: photos[0].photoUrl,
          }];
        }

        setGift({
          ...DEMO_GIFT,
          title: giftResult.data.title || DEMO_GIFT.title,
          photos,
          songs,
        });
        setIsDemo(false);
      }

      setIsLoading(false);
    }

    void loadGift();
    return () => {
      active = false;
      if (openingTimer.current) clearTimeout(openingTimer.current);
    };
  }, [giftId]);

  const nextPhoto = useCallback(() => {
    setPhotoIndex((current) => (current + 1) % gift.photos.length);
  }, [gift.photos.length]);

  const previousPhoto = useCallback(() => {
    setPhotoIndex((current) => (current - 1 + gift.photos.length) % gift.photos.length);
  }, [gift.photos.length]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (phase === 'photos' && photoOpen) setPhotoOpen(false);
        else if (!['locked', 'opening', 'hub'].includes(phase)) setPhase('hub');
        return;
      }
      if (phase === 'photos' && photoOpen && event.key === 'ArrowRight') nextPhoto();
      if (phase === 'photos' && photoOpen && event.key === 'ArrowLeft') previousPhoto();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [nextPhoto, phase, photoOpen, previousPhoto]);

  const openModule = (nextPhase: Phase) => {
    setMessage('');
    setPhase(nextPhase);
  };

  const pressKey = (key: string) => {
    setMessage('');
    if (key === 'clear') return setPin('');
    if (key === 'back') return setPin((value) => value.slice(0, -1));
    setPin((value) => (value.length < passcode.length ? value + key : value));
  };

  const unlock = () => {
    if (pin !== passcode) {
      setMessage('Chưa đúng rồi, thử lại nhé ♡');
      setPin('');
      return;
    }

    if (audioRef.current && currentSong?.songUrl) {
      audioRef.current.src = currentSong.songUrl;
      void audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    setMessage('');
    setPhase('opening');
    openingTimer.current = setTimeout(() => setPhase('hub'), 1850);
  };

  const playSong = (songIndex: number) => {
    const song = gift.songs[songIndex];
    setActiveSong(songIndex);
    setMessage('');

    if (!song.songUrl || !audioRef.current) {
      setIsPlaying(false);
      setMessage('Bài này đang là dữ liệu mẫu. Thêm song_url trong Supabase để phát nhạc nhé.');
      return;
    }

    audioRef.current.src = song.songUrl;
    void audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.songUrl) {
      setMessage('Thêm danh sách nhạc vào Supabase để bật trình phát.');
      return;
    }

    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNextSong = () => {
    const nextIndex = (activeSong + 1) % gift.songs.length;
    playSong(nextIndex);
  };

  if (isLoading) {
    return (
      <main className="loading-screen" aria-label="Đang chuẩn bị món quà">
        <span className="loading-heart">♡</span>
        <p>Đang chuẩn bị một điều thật đẹp…</p>
      </main>
    );
  }

  return (
    <main className={`reveal-app phase-${phase}`}>
      <audio
        ref={audioRef}
        src={currentSong?.songUrl ?? undefined}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={playNextSong}
      />

      {phase === 'locked' && (
        <section className="lock-screen">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <span className="floating-mark mark-one">✿</span>
          <span className="floating-mark mark-two">♡</span>
          <span className="floating-mark mark-three">✦</span>

          <div className="lock-card" aria-labelledby="gift-title">
            <div className="love-stamp" aria-hidden="true"><span>♡</span></div>
            <p className="eyebrow">A little something for you</p>
            <h1 id="gift-title">Mở món quà nhỏ này nhé</h1>
            <p className="intro">Nhập {passcode.length} con số đặc biệt để xem điều đang chờ bạn ở bên trong.</p>

            <div className="pin-dots" aria-label={`Đã nhập ${pin.length} trên ${passcode.length} số`}>
              {Array.from({ length: passcode.length }, (_, dot) => (
                <span key={dot} className={dot < pin.length ? 'filled' : ''} />
              ))}
            </div>

            <div className="keypad" aria-label="Bàn phím nhập mã">
              {KEYS.map((key) => (
                <button
                  type="button"
                  className={key === 'clear' || key === 'back' ? 'key key-secondary' : 'key'}
                  key={key}
                  onClick={() => pressKey(key)}
                  aria-label={key === 'clear' ? 'Xóa hết' : key === 'back' ? 'Xóa một số' : `Số ${key}`}
                >
                  {key === 'clear' ? 'C' : key === 'back' ? '⌫' : key}
                </button>
              ))}
            </div>

            <button className="unlock-button" onClick={unlock} disabled={pin.length !== passcode.length}>
              <span>Mở quà</span><span aria-hidden="true">→</span>
            </button>

            <p className="hint">Gợi ý: một ngày rất đặc biệt{isDemo && ' · Mã xem thử: 2208'}</p>
            <p className="status" role="status" aria-live="polite">{message}</p>
          </div>

          <p className="signature">made with <span>♥</span> for someone special</p>
        </section>
      )}

      {phase === 'opening' && (
        <section className="opening-screen" aria-label="Đang mở quà">
          <div className="opening-glow" />
          {PETALS.map((petal) => (
            <span
              className="petal"
              key={petal.id}
              style={{ '--petal-x': `${petal.left}vw`, '--petal-delay': `${petal.delay}s`, '--petal-duration': `${petal.duration}s`, '--petal-size': `${petal.size}px` } as CSSProperties}
            >
              {petal.symbol}
            </span>
          ))}
          <div className="opening-note"><span>♡</span><p>Dành riêng cho bạn</p></div>
        </section>
      )}

      {phase === 'hub' && (
        <section className="gift-hub">
          <header className="hub-heading">
            <p className="eyebrow">For my favorite person</p>
            <h2>Một góc nhỏ dành cho bạn</h2>
            <p>Chạm vào từng món để mở những điều mình đã cất riêng ở đây.</p>
          </header>

          <div className="hub-grid">
            <button className="hub-module module-music" onClick={() => openModule('music')}>
              <span className="module-number">01</span>
              <span className={isPlaying ? 'module-icon music-playing' : 'module-icon'}>♫</span>
              <span className="module-copy"><strong>Danh sách nhạc</strong><small>{gift.songs.length} bài hát của chúng mình</small></span>
              <span className="module-arrow">↗</span>
            </button>
            <button className="hub-module module-photos" onClick={() => openModule('photos')}>
              <span className="module-number">02</span>
              <span className="module-icon">▣</span>
              <span className="module-copy"><strong>Danh sách ảnh</strong><small>{gift.photos.length} khoảnh khắc được giữ lại</small></span>
              <span className="module-arrow">↗</span>
            </button>
            <button className="hub-module module-letter" onClick={() => openModule('letter')}>
              <span className="module-number">03</span>
              <span className="module-icon">✉</span>
              <span className="module-copy"><strong>Một lá thư</strong><small>Những điều mình muốn nói</small></span>
              <span className="module-arrow">↗</span>
            </button>
            <button className="hub-module module-gift" onClick={() => { setHeartOpened(false); openModule('heart'); }}>
              <span className="module-number">04</span>
              <span className="module-icon heart-icon">♥</span>
              <span className="module-copy"><strong>Món quà bí mật</strong><small>Chạm vào trái tim này nhé</small></span>
              <span className="module-arrow">↗</span>
            </button>
          </div>

          <p className="hub-signature">4 điều nhỏ · dành cho một người thật đặc biệt</p>
        </section>
      )}

      {phase === 'music' && (
        <section className="module-screen music-screen">
          <header className="module-topbar">
            <button className="back-button" onClick={() => openModule('hub')}><span>←</span> Quay lại</button>
            <div><p className="eyebrow">Our soundtrack</p><h2>Danh sách nhạc</h2></div>
            <span className="module-count">{String(gift.songs.length).padStart(2, '0')} bài</span>
          </header>

          <div className="music-layout">
            <div className="now-playing-card">
              <div className={isPlaying ? 'vinyl-cover spinning' : 'vinyl-cover'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentSong.coverUrl} alt="Ảnh bìa bài hát" />
                <span className="vinyl-center" />
              </div>
              <div className="now-playing-copy">
                <p>Đang phát</p>
                <h3>{currentSong.title}</h3>
                <span>{currentSong.artist}</span>
              </div>
              <input
                className="song-progress"
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  if (audioRef.current) audioRef.current.currentTime = nextTime;
                  setCurrentTime(nextTime);
                }}
                aria-label="Tiến độ bài hát"
              />
              <div className="song-time"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
              <div className="player-controls">
                <button onClick={() => playSong((activeSong - 1 + gift.songs.length) % gift.songs.length)} aria-label="Bài trước">‹</button>
                <button className="play-button" onClick={toggleMusic} aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}>{isPlaying ? 'Ⅱ' : '▶'}</button>
                <button onClick={playNextSong} aria-label="Bài tiếp">›</button>
              </div>
            </div>

            <div className="playlist-card">
              <div className="playlist-heading"><span>Playlist dành riêng cho bạn</span><small>♡</small></div>
              <div className="song-list">
                {gift.songs.map((song, index) => (
                  <button key={song.id} className={index === activeSong ? 'song-row active' : 'song-row'} onClick={() => playSong(index)}>
                    <span className="song-index">{index === activeSong && isPlaying ? '♫' : String(index + 1).padStart(2, '0')}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={song.coverUrl} alt="" />
                    <span className="song-copy"><strong>{song.title}</strong><small>{song.artist}</small></span>
                    <span className="song-action">{song.songUrl ? '▶' : '· · ·'}</span>
                  </button>
                ))}
              </div>
              <p className="playlist-message" role="status">{message}</p>
            </div>
          </div>
        </section>
      )}

      {phase === 'photos' && (
        <section className="module-screen photo-list-screen">
          <header className="module-topbar">
            <button className="back-button" onClick={() => openModule('hub')}><span>←</span> Quay lại</button>
            <div><p className="eyebrow">Our little archive</p><h2>Danh sách ảnh</h2></div>
            <span className="module-count">{String(gift.photos.length).padStart(2, '0')} ảnh</span>
          </header>

          <div className="photo-list-grid">
            {gift.photos.map((photo, index) => (
              <button key={photo.id} className={`photo-tile tile-${index % 5}`} onClick={() => { setPhotoIndex(index); setPhotoOpen(true); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.photoUrl} alt={photo.caption} />
                <span className="tile-overlay"><small>{String(index + 1).padStart(2, '0')}</small><strong>{photo.caption}</strong></span>
              </button>
            ))}
          </div>

          {photoOpen && (
            <div className="photo-lightbox" ref={photoStageRef} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => {
              if (touchStart.current === null) return;
              const distance = event.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(distance) > 48) distance > 0 ? previousPhoto() : nextPhoto();
              touchStart.current = null;
            }}>
              <button className="lightbox-close" onClick={() => setPhotoOpen(false)} aria-label="Đóng ảnh">×</button>
              <button className="nav-button" onClick={previousPhoto} aria-label="Ảnh trước">‹</button>
              <article className="photo-card" key={gift.photos[photoIndex].id}>
                <div className="photo-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gift.photos[photoIndex].photoUrl} alt={gift.photos[photoIndex].caption} />
                  <span className="photo-number">{String(photoIndex + 1).padStart(2, '0')}</span>
                </div>
                <div className="caption-row"><span className="caption-heart">♡</span><p>{gift.photos[photoIndex].caption}</p></div>
              </article>
              <button className="nav-button" onClick={nextPhoto} aria-label="Ảnh tiếp theo">›</button>
            </div>
          )}
        </section>
      )}

      {phase === 'letter' && (
        <section className="module-screen letter-screen">
          <header className="module-topbar letter-topbar">
            <button className="back-button" onClick={() => openModule('hub')}><span>←</span> Quay lại</button>
            <div><p className="eyebrow">Words from my heart</p><h2>Một lá thư</h2></div>
            <span className="module-count">03</span>
          </header>

          <div className="letter-wrap">
            <div className="envelope-back" aria-hidden="true"><span>♥</span></div>
            <article className="letter-paper">
              <div className="letter-date">22 · 08 · 2026</div>
              <p className="letter-greeting">Gửi người đặc biệt,</p>
              {gift.letter.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="letter-signoff"><span>Thương gửi,</span><strong>Một người luôn trân trọng bạn ♡</strong></div>
            </article>
          </div>
        </section>
      )}

      {phase === 'heart' && (
        <section className={heartOpened ? 'dark-heart-screen opened' : 'dark-heart-screen'}>
          <button className="dark-back-button" onClick={() => openModule('hub')}><span>←</span> Quay lại</button>
          <p className="dark-heart-kicker">THE SECRET GIFT · 04</p>

          <div className="particle-heart-wrap">
            <ParticleHeartCanvas burst={heartOpened} />
            <button
              className="particle-heart-hit"
              onClick={() => setHeartOpened(true)}
              aria-label="Chạm để mở trái tim hạt phát sáng"
              disabled={heartOpened}
            />
          </div>

          {!heartOpened && (
            <div className="heart-tap-copy">
              <strong>Chạm vào trái tim</strong>
              <span>để mở món quà cuối cùng</span>
            </div>
          )}

          <div className="particle-heart-message" aria-hidden={!heartOpened}>
            <p>This heart is yours</p>
            <h2>Trái tim này<br />là dành cho bạn</h2>
            <span>{gift.giftMessage}</span>
            <button onClick={() => openModule('hub')}>Về 4 món quà <b>←</b></button>
          </div>

          <button className="dark-music-button" onClick={toggleMusic} aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}>{isPlaying ? '♫' : '♪'}</button>
          <div className="heart-stars" aria-hidden="true">✦　·　✧　·　✦</div>
        </section>
      )}
    </main>
  );
}
