'use client';

import { useEffect, useState } from 'react';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import ApplicantListPageClient from '@/app/components/ApplicantListPageClient';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const APPLICANTS_PER_PAGE = 5;

export default function ApplicantsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const { admin } = useAdminAuth();

  // 応募者一覧を取得
  const fetchApplicants = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/applicants?page=${page}&limit=${APPLICANTS_PER_PAGE}`,
      );
      const data = await response.json();

      if (data.success) {
        setApplicants(data.applicants || []);
        setTotalApplicants(data.totalCount || 0);
        setCurrentPage(page);
      } else {
        setError('応募者一覧の取得に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchApplicants(1);
    }
  }, [admin]);

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
          <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
            <div className="flex items-center justify-center py-12">
              <p className="text-lg text-gray-600">読み込み中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">
              応募者一覧
            </h1>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <ApplicantListPageClient
              applicants={applicants}
              currentPage={currentPage}
              totalApplicants={totalApplicants}
              applicantsPerPage={APPLICANTS_PER_PAGE}
              onPageChange={fetchApplicants}
            />
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
