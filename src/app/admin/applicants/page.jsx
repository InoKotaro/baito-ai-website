import ApplicantListPageClient from '@/app/components/ApplicantListPageClient';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { dummyApplicants } from '@/data/siteData';

// サーバー側でデータを取得する想定
async function getApplicants() {
  // 本来はAPIやデータベースからデータを取得します
  // ここではUI確認用にダミーデータを返します
  return dummyApplicants;
}

export default async function ApplicantListPage() {
  const applicants = await getApplicants();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-700">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-grow px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">応募者一覧</h1>
        <ApplicantListPageClient applicants={applicants} />
      </main>
      <Footer />
    </div>
  );
}
