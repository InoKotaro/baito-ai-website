'use client';
import Link from 'next/link';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';

const newsItems = [
  {
    id: 1,
    date: '202☓-10-27',
    title: '面接対策セミナーのアーカイブ配信開始',
    description: `面接に不安がある方へ、面接対策セミナーのアーカイブを公開しました。
準備のコツや質問対策を学べます。ぜひご活用ください。`,
  },
  {
    id: 2,
    date: '202☓-10-20',
    title: '会員登録キャンペーン実施中',
    description:
      '新規会員登録をされた方の中から抽選で、Amazonギフト券500円分をプレゼント',
  },
  {
    id: 3,
    date: '202☓-09-15',
    title: '当サイトに掲載されている求人ついて',
    description:
      '当サイトに掲載されている求人情報は、ポートフォリオ制作を目的としたサンプルデータです。実際の募集は行っておりません。',
  },
];

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ヘッダー */}
      <Header />

      <main className="container mx-auto max-w-3xl flex-grow px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-800">
          お知らせ
        </h1>
        <div className="space-y-4">
          {newsItems.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm text-gray-500">{item.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-700">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
