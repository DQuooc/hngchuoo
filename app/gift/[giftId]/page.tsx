import type { Metadata } from 'next';
import GiftReveal from '../../gift-reveal';
import { getSupabaseClient } from '@/lib/supabase';

type GiftParams = { params: Promise<{ giftId: string }> };

export async function generateMetadata({ params }: GiftParams): Promise<Metadata> {
  const { giftId } = await params;
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      title: 'Một món quà dành cho bạn',
      description: 'Mở khóa những khoảnh khắc và giai điệu riêng.',
    };
  }

  const [{ data: gift }, { data: photos }] = await Promise.all([
    supabase.from('gifts').select('title').eq('id', giftId).single(),
    supabase.from('gift_photos').select('photo_url,caption').eq('gift_id', giftId).order('order_index').limit(1),
  ]);

  const title = gift?.title || 'Một món quà dành cho bạn';
  const description = photos?.[0]?.caption || 'Mở khóa những khoảnh khắc và giai điệu riêng.';
  const image = photos?.[0]?.photo_url;

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : [] },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] },
  };
}

export default async function GiftPage({ params }: GiftParams) {
  const { giftId } = await params;
  return <GiftReveal giftId={giftId} />;
}
