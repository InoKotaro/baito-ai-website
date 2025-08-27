import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import ApplicantListPageClient from '@/app/components/ApplicantListPageClient';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const APPLICANTS_PER_PAGE = 5;

// サーバー側でデータを取得
async function getApplicants(page = 1) {
  const from = (page - 1) * APPLICANTS_PER_PAGE;
  const to = from + APPLICANTS_PER_PAGE - 1;

  const { data, error, count } = await supabaseAdmin
    .from('JobApplication')
    .select(
      `
      id,
      appliedat,
      user:User(name, email),
      job:Job(jobtitle, companyname)
    `,
      { count: 'exact' },
    )
    .order('appliedat', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching applicants:', error.message);
    return { applicants: [], totalApplicants: 0 };
  }

  // フロントエンドが期待する形式にデータを変換
  const mappedApplicants = data.map((app) => ({
    id: app.id,
    name: app.user.name,
    email: app.user.email,
    appliedDate: new Date(app.appliedat).toLocaleDateString('ja-JP'),
    jobTitle: app.job.jobtitle,
    companyName: app.job.companyname,
  }));

  return { applicants: mappedApplicants, totalApplicants: count };
}

export default async function ApplicantListPage({ searchParams }) {
  const page = searchParams?.page ? parseInt(searchParams.page, 5) : 1;
  const { applicants, totalApplicants } = await getApplicants(page);

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-700">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-grow px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-blue-800">応募者一覧</h1>
          <ApplicantListPageClient
            applicants={applicants}
            currentPage={page}
            totalApplicants={totalApplicants}
            applicantsPerPage={APPLICANTS_PER_PAGE}
          />
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
