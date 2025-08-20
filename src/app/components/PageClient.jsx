'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import JobCard from '@/app/components/JobCard';
import Pagination from '@/app/components/Pagination';
import ScrollToTopButton from '@/app/components/ScrollToTopButton';
import SearchBar from '@/app/components/SearchBar';
import StickySearchBar from '@/app/components/StickySearchBar';
import { supabase } from '@/lib/supabaseClient';

export default function JobPortfolioSite() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLからpageを取得（なければ1）
  const initialPage = Number(searchParams.get('page')) || 1;

  const [allJobs, setAllJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsPerPage] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  const searchBarRef = useRef(null);

  // APIから求人データ取得
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('Job')
        .select(
          '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename, railwayCompany:RailwayCompany(railwayCompanyName:name))',
        );

      if (error) {
        console.error('Error fetching jobs:', JSON.stringify(error, null, 2));
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
        setIsSticky(window.scrollY > searchBarRef.current.offsetTop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ページネーションの計算
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);

  // ページ変更
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`); // ← URL更新
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => paginate(currentPage + 1);
  const prevPage = () => paginate(currentPage - 1);

  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-gray-700 ${
        isMenuOpen ? 'h-screen overflow-hidden md:h-auto md:overflow-auto' : ''
      }`}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* 固定検索バー */}
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
        <div ref={searchBarRef} className="mb-8">
          <SearchBar />
        </div>

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

      <Footer />
      {!isMenuOpen && <ScrollToTopButton />}
    </div>
  );
}
