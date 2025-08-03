'use client';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import SearchBar from '@/app/components/SearchBar';

export default function JobPortfolioSite() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-700">
      {/* ヘッダー */}
      <Header />

      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        {/* 検索セクション */}
        <SearchBar />

        {/* 求人一覧 */}
        <JobCard />
      </main>

      {/* フッター */}
      <Footer />
      {/* トップへ戻るボタン */}
      <ScrollToTopButton />
    </div>
  );
}
