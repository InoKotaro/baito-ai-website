'use client';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
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
        <JobCard />
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
