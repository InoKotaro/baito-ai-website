'use client';
import { useRouter, useSearchParams } from 'next/navigation';
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
  // 検索条件管理用
  const [searchState, setSearchState] = useState({
    line: '',
    wage: '',
    occupation: '',
  });

  // 検索ボタン押下時に即座に結果を表示する関数
  const handleSearch = async (form) => {
    setIsLoading(true);
    setError(null);
    let query = supabase
      .from('Job')
      .select(
        '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename, railwayCompany:RailwayCompany(railwayCompanyName:name))',
      );
    if (form.line) query = query.eq('lineid', form.line);
    if (form.wage) query = query.gte('hourlywage', Number(form.wage));
    if (form.occupation) query = query.eq('occupationid', form.occupation);
    query = query.order('id', { ascending: false }); // Add order here
    const { data, error } = await query;
    if (error) {
      setError('求人情報の取得に失敗しました。');
    } else {
      setAllJobs(data);
    }
    setIsLoading(false);
    setSearchState(form);
  };

  // 検索状態をリセットして全件表示に戻す関数
  const resetSearch = async () => {
    setIsLoading(true);
    setError(null);
    setSearchState({ line: '', wage: '', occupation: '' });

    // 全件取得
    const { data, error } = await supabase
      .from('Job')
      .select(
        '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename, railwayCompany:RailwayCompany(railwayCompanyName:name))',
      )
      .order('id', { ascending: false });

    if (error) {
      setError('求人情報の取得に失敗しました。');
    } else {
      setAllJobs(data);
    }
    setIsLoading(false);

    // ページを1ページ目に戻す
    router.push('?page=1');
  };

  const { lines, wages, occupations } = useSearchOptions();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsPerPage] = useState(7);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  const searchBarRef = useRef(null);

  // APIから求人データ取得
  // 初回のみ全件取得
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('Job')
        .select(
          '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename, railwayCompany:RailwayCompany(railwayCompanyName:name))',
        ).order('id', { ascending: false });
      if (error) {
        setError('求人情報の取得に失敗しました。');
      } else {
        setAllJobs(data);
      }
      setIsLoading(false);
    };
    fetchJobs();
  }, [searchParams]);

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
    router.push(`?page=${pageNumber}`);
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
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onLogoClick={resetSearch}
      />

      {/* 固定検索バー */}
      <div
        className={`fixed left-0 right-0 top-0 z-30 bg-orange-50/95 shadow-md backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isSticky ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      ></div>

      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <div ref={searchBarRef} className="mb-8">
          <SearchBar
            lines={lines}
            wages={wages}
            occupations={occupations}
            onSearch={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="py-10 text-center">求人情報を読み込んでいます。</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">エラー: {error}</div>
        ) : currentJobs.length === 0 ? (
          <div className="py-10 text-center text-gray-600">
            該当する求人はありません。
          </div>
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
