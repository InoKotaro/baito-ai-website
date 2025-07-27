'use client';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';

export default function JobPortfolioSite() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-700">
      {/* ヘッダー */}
      <Header />

      <main className="mx-auto mt-8 max-w-4xl px-4">
        {/* 検索セクション */}
        <SearchBar />

        {/* 求人一覧 */}
        <section aria-label="求人一覧">
          <article className="mb-6 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <h2 className="mb-1 text-xl font-bold text-blue-800">
              【コンビニスタッフ】株式会社フレッシュ365
            </h2>
            <p className="mb-2 font-semibold">
              コンビニでの接客やレジ、商品補充の仕事です。
            </p>
            <p className="mb-4 whitespace-pre-line text-sm text-gray-600">
              レジ対応や商品の陳列、清掃などを行います。
              未経験でも丁寧に教えるので安心です。忙しい時間帯もありますが、
              チームで助け合いながら働けます。
            </p>
            <p className="text-sm">
              時給: 1100円〜1300円
              <br />
              勤務時間: 8:00〜22:00（シフト制）
            </p>
          </article>

          {/* 他の求人カードもここに追加可能 */}
        </section>
      </main>
       <Footer/>
    </div>
   
  );
}
