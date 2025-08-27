'use client';
import { useEffect, useRef, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
import Pagination from '@/app/components/Pagination';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import SearchBar from '@/app/components/SearchBar';
import StickySearchBar from '@/app/components/StickySearchBar';
import { supabase } from '@/lib/supabaseClient';

import useSearchOptions from '../hooks/useSearchOptions';

export default function JobPortfolioSite() {
  const {
    railwayCompanies,
    wages,
    jobCategories,
    loading: optionsLoading,
  } = useSearchOptions();
  const [allJobs, setAllJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // 1ページ内表示件数
  const [jobsPerPage] = useState(3);

  const [isSticky, setIsSticky] = useState(false);
  const searchBarRef = useRef(null);

  // APIから求人データを非同期で取得
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      // 'Job' テーブルから全ての求人情報を取得
      const { data, error } = await supabase
        .from('Job')
        .select(
          '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename)',
        );

      if (error) {
        console.error('Error fetching jobs:', error);
        setError('求人情報の取得に失敗しました。');
      } else {
        setAllJobs(data);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  // スクロールイベントの処理
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        // 元の検索バーが画面上部から見えなくなったら、固定バーを表示
        setIsSticky(window.scrollY > searchBarRef.current.offsetTop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ページに表示する求人を計算
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);

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

      {/* 固定表示用の検索バー */}
      <div
        className={`fixed left-0 right-0 top-0 z-30 bg-orange-50/95 shadow-md backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isSticky ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-2">
          <StickySearchBar />
        </div>
      </div>

      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        {/* 検索セクション */}
        <div ref={searchBarRef} className="mb-8">
          <SearchBar
            railwayCompanies={railwayCompanies}
            wages={wages}
            jobCategories={jobCategories}
          />
        </div>

        {/* 求人一覧と状態表示 */}
        {isLoading ? (
          <div className="py-10 text-center">求人情報を読み込んでいます。</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">エラー: {error}</div>
        ) : (
          <>
            <JobCard jobs={currentJobs} />
            <Pagination
              jobsPerPage={jobsPerPage}
              totalJobs={allJobs.length}
              paginate={paginate}
              currentPage={currentPage}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          </>
        )}
      </main>

      {/* フッター */}
      <Footer />
      {/* トップへ戻るボタン */}
      <ScrollToTopButton />
    </div>
  );
}
