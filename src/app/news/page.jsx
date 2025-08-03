'use client';
import { useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';

const newsItems = [
  {
    id: 1,
    date: '202☓-10-27',
    title: '面接対策セミナーのアーカイブ配信開始',
    description: `面接対策セミナーのアーカイブを公開しました。
準備のコツや質問対策を学べます。ぜひご活用ください。`,
  },
  {
    id: 2,
    date: '202☓-10-20',
    title: '新規会員登録キャンペーン実施中',
    description: `新規会員登録をされた方の中から抽選で、Amazonギフト券500円分をプレゼント`,
  },
  {
    id: 3,
    date: '202☓-09-15',
    title: '掲載されている求人ついて',
    description: `当サイトに掲載されている求人情報は、ポートフォリオ用サンプルデータです。
応募しても企業から連絡は来ません。予めご了承ください。`,
  },
];

export default function NewsPage() {
  const [openItemId, setOpenItemId] = useState(null);

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
            <div key={item.id} className="rounded-lg border bg-white shadow-sm">
              <button
                onClick={() =>
                  setOpenItemId(openItemId === item.id ? null : item.id)
                }
                className="flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-700">
                    {item.title}
                  </h2>
                </div>
                <span className="text-2xl font-light text-gray-500">
                  {openItemId === item.id ? '−' : '+'}
                </span>
              </button>
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openItemId === item.id
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6">
                    <p className="whitespace-pre-wrap text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* フッター */}
      <Footer />

      <ScrollToTopButton />
    </div>
  );
}
