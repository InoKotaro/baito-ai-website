'use client';
import { useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
import Pagination from '@/app/components/Pagination';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import SearchBar from '@/app/components/SearchBar';
import { jobs } from '@/data/siteData';

export default function JobPortfolioSite() {
  const [currentPage, setCurrentPage] = useState(1);
  // 1ページ内表示件数
  const [jobsPerPage] = useState(3);

  // ページに表示する求人を計算
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // ページを変更する関数（ページトップへのスクロール機能付き）
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => paginate(currentPage + 1);
  const prevPage = () => paginate(currentPage - 1);

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      {/* ヘッダー */}
      <Header />

      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        {/* 検索セクション */}
        <SearchBar />

        {/* 求人一覧 */}
        <JobCard jobs={currentJobs} />

        {/* ページネーション */}
        <Pagination
          jobsPerPage={jobsPerPage}
          totalJobs={jobs.length}
          paginate={paginate}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </main>

      {/* フッター */}
      <Footer />
      {/* トップへ戻るボタン */}
      <ScrollToTopButton />
    </div>
  );
}
