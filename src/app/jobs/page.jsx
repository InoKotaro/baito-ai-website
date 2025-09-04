'use client';
import { useEffect, useRef, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
import Pagination from '@/app/components/Pagination';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import SearchBar from '@/app/components/SearchBar';
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

  // 検索条件で求人一覧を絞り込む
  const handleSearch = (form) => {
    let filtered = allJobs;
    if (form.line) {
      filtered = filtered.filter((job) => job.line?.id === form.line);
    }
    if (form.wage) {
      filtered = filtered.filter(
        (job) => String(job.wage?.value) === String(form.wage),
      );
    }
    if (form.occupation) {
      filtered = filtered.filter(
        (job) => job.occupation?.id === form.occupation,
      );
    }
    setCurrentPage(1);
    setAllJobs(filtered);
  };

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      {/* ヘッダー */}
      <Header />

      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        {/* 検索セクション */}
        <div ref={searchBarRef} className="mb-8">
          <SearchBar
            railwayCompanies={railwayCompanies}
            wages={wages}
            jobCategories={jobCategories}
            onSearch={handleSearch}
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
