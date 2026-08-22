'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

type Photo = {
  id: string;
  photoUrl: string;
  caption: string;
};

type Gift = {
  title: string;
  songUrl: string | null;
  photos: Photo[];
};

type Phase = 'locked' | 'opening' | 'gallery' | 'bubbles';

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

const DEMO_GIFT: Gift = {
  title: 'Những điều mình muốn giữ lại',
  songUrl: null,
  photos: DEMO_PHOTOS,
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

export default function GiftReveal({ giftId }: { giftId?: string }) {
  const [gift, setGift] = useState<Gift>(DEMO_GIFT);
  const [phase, setPhase] = useState<Phase>('locked');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<number | null>(null);

  const passcode = process.env.NEXT_PUBLIC_GIFT_PASSCODE ?? '2208';

  useEffect(() => {
    let active = true;

    async function loadGift() {
      const supabase = getSupabaseClient();
      const requestedId = resolveGiftId(giftId);

      if (!supabase || !requestedId) {
        if (active) setIsLoading(false);
        return;
      }

      const [{ data: giftRow, error: giftError }, { data: photoRows, error: photoError }] = await Promise.all([
        supabase.from('gifts').select('id,title,song_url').eq('id', requestedId).single(),
        supabase
          .from('gift_photos')
          .select('id,photo_url,caption,order_index')
          .eq('gift_id', requestedId)
          .order('order_index', { ascending: true }),
      ]);

      if (!active) return;

      if (!giftError && !photoError && giftRow && photoRows?.length) {
        setGift({
          title: giftRow.title || 'Những điều mình muốn giữ lại',
          songUrl: giftRow.song_url,
          photos: photoRows.map((photo) => ({
            id: photo.id,
            photoUrl: photo.photo_url,
            caption: photo.caption || 'Một khoảnh khắc thật đẹp của chúng mình.',
          })),
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

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % gift.photos.length);
  }, [gift.photos.length]);

  const previous = useCallback(() => {
    setIndex((current) => (current - 1 + gift.photos.length) % gift.photos.length);
  }, [gift.photos.length]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (phase !== 'gallery') return;
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'Escape') setPhase('bubbles');
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [next, phase, previous]);

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

    if (audioRef.current && gift.songUrl) {
      void audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    setMessage('');
    setPhase('opening');
    openingTimer.current = setTimeout(() => setPhase('gallery'), 1850);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio || !gift.songUrl) {
      setMessage('Thêm song_url trong Supabase để bật nhạc nền.');
      return;
    }

    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void stageRef.current?.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  const bubblePhotos = useMemo(
    () => gift.photos.slice(0, 8).map((photo, photoIndex) => ({
      ...photo,
      x: (photoIndex * 29 + 6) % 88,
      y: (photoIndex * 19 + 5) % 64,
      size: 78 + ((photoIndex * 31) % 74),
      delay: -((photoIndex * 7) % 16) / 3,
    })),
    [gift.photos],
  );

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
      <audio ref={audioRef} src={gift.songUrl ?? undefined} loop preload="auto" />

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
          <div className="opening-note">
            <span>♡</span>
            <p>Dành riêng cho bạn</p>
          </div>
        </section>
      )}

      {phase === 'gallery' && (
        <section className="gallery-screen" ref={stageRef}>
          <header className="gallery-topbar">
            <div>
              <p className="eyebrow">Our little archive</p>
              <h2>{gift.title}</h2>
            </div>
            <div className="gallery-tools">
              <button onClick={toggleMusic} aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'} className={isPlaying ? 'tool-button active' : 'tool-button'}>
                {isPlaying ? '♫' : '♪'}
              </button>
              <button onClick={toggleFullscreen} aria-label="Xem toàn màn hình" className="tool-button">↗</button>
              <button onClick={() => setPhase('bubbles')} aria-label="Đóng bộ ảnh" className="tool-button close-tool">×</button>
            </div>
          </header>

          <div className="gallery-stage" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(distance) > 48) distance > 0 ? previous() : next();
            touchStart.current = null;
          }}>
            <button className="nav-button nav-previous" onClick={previous} aria-label="Ảnh trước">‹</button>

            <article className="photo-card" key={gift.photos[index].id}>
              <div className="photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gift.photos[index].photoUrl} alt={gift.photos[index].caption} />
                <span className="photo-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="caption-row">
                <span className="caption-heart">♡</span>
                <p>{gift.photos[index].caption}</p>
              </div>
            </article>

            <button className="nav-button nav-next" onClick={next} aria-label="Ảnh tiếp theo">›</button>
          </div>

          <footer className="gallery-footer">
            <div className="progress-track" aria-label={`Ảnh ${index + 1} trên ${gift.photos.length}`}>
              {gift.photos.map((photo, photoIndex) => (
                <button key={photo.id} className={photoIndex === index ? 'progress-dot active' : 'progress-dot'} onClick={() => setIndex(photoIndex)} aria-label={`Xem ảnh ${photoIndex + 1}`} />
              ))}
            </div>
            <p>Vuốt hoặc dùng phím mũi tên để xem tiếp</p>
          </footer>

          {message && <p className="music-message" role="status">{message}</p>}
        </section>
      )}

      {phase === 'bubbles' && (
        <section className="bubble-screen">
          <div className="bubble-field" aria-hidden="true">
            {bubblePhotos.map((photo) => (
              <div
                className="memory-bubble"
                key={photo.id}
                style={{ '--bubble-x': `${photo.x}%`, '--bubble-y': `${photo.y}%`, '--bubble-size': `${photo.size}px`, '--bubble-delay': `${photo.delay}s` } as CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.photoUrl} alt="" />
              </div>
            ))}
          </div>

          <div className="final-note">
            <p className="eyebrow">One last thing</p>
            <h2>Cảm ơn vì đã ở đây</h2>
            <p>Mỗi kỷ niệm đều đẹp hơn vì có bạn ở trong đó. Mong rằng món quà nhỏ này đã làm bạn mỉm cười.</p>
            <button onClick={() => { setIndex(0); setPhase('gallery'); }}>Xem lại từ đầu <span>↻</span></button>
          </div>

          <button className="floating-music" onClick={toggleMusic} aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}>{isPlaying ? '♫' : '♪'}</button>
        </section>
      )}
    </main>
  );
}
