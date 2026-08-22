import type { Metadata } from 'next';
import './globals.css';

const title = 'Một món quà dành cho bạn';
const description = 'Mở khóa những khoảnh khắc và giai điệu riêng.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
