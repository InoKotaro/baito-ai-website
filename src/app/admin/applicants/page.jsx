'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import ApplicantCard from '@/app/components/ApplicantCard';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Pagination from '@/app/components/Pagination';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function ApplicantsPage() {
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { admin } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const [applicantsPerPage] = useState(5); // 1ページあたりの応募者数

  // 応募者一覧を取得
  const fetchApplicants = async () => {
    if (!admin) return;
    try {
      setLoading(true);
      const response = await fetch('/api/applicants');
      const data = await response.json();

      if (data.success) {
        // 管理者の企業の求人への応募者のみフィルタリング
        const adminApplicants = data.applicants.filter(
          (applicant) => applicant.job.company === admin.name,
        );
        setAllApplicants(adminApplicants);
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
    fetchApplicants();
  }, [admin]);

  // ページネーションの計算
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = allApplicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant,
  );

  // ページ変更
  const paginate = (pageNumber) => {
    router.push(`/admin/applicants?page=${pageNumber}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => paginate(currentPage + 1);
  const prevPage = () => paginate(currentPage - 1);

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
          {admin && <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
            <div className="flex items-center justify-center py-12">
              <p className="text-lg text-gray-600">読み込み中</p>
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
        {admin && <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
        <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-blue-800">
              応募者一覧
            </h1>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {allApplicants.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600">まだ応募者がいません</p>
              </div>
            ) : (
              <>
                <div>
                  {currentApplicants.map((applicant) => (
                    <ApplicantCard key={applicant.id} applicant={applicant} />
                  ))}
                </div>
                <Pagination
                  jobsPerPage={applicantsPerPage}
                  totalJobs={allApplicants.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}