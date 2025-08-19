'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

const FALLBACK_IMAGE_URL = '/images/no-image.jpg';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 0) アプリ内ユーザーIDを取得（authのUUIDではなく、アプリDBの整数ID）
      const { data: dbUser, error: dbUserError } = await supabase
        .from('User')
        .select('id')
        .eq('email', user.email)
        .single();

      let appUserId = dbUser?.id;
      if (dbUserError || !dbUser) {
        const fallbackName =
          user.user_metadata?.full_name ||
          (user.email ? user.email.split('@')[0] : 'ユーザー');

        const { data: insertedUser, error: insertUserError } = await supabase
          .from('User')
          .insert({ email: user.email, name: fallbackName, password: '' })
          .select('id')
          .single();

        if (insertUserError || !insertedUser) {
          console.error(
            'Error creating app user:',
            JSON.stringify(insertUserError || {}),
          );

          setLoading(false);
          return;
        }
        appUserId = insertedUser.id;
      }

      // 1) 応募履歴のみ取得（ジョインなし）
      const { data: appRows, error: appsError } = await supabase
        .from('JobApplication')
        .select('id, appliedat, jobid')
        .eq('userid', appUserId)
        .order('appliedat', { ascending: false });

      if (appsError) {
        console.error(
          'Error fetching applications:',
          JSON.stringify(appsError),
        );

        setLoading(false);
        return;
      }

      if (!appRows || appRows.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // 2) 関連求人を一括取得
      const jobIds = Array.from(new Set(appRows.map((r) => r.jobid)));
      const { data: jobs, error: jobsError } = await supabase
        .from('Job')
        .select('*')
        .in('id', jobIds);

      if (jobsError) {
        console.error(
          'Error fetching jobs for applications:',
          JSON.stringify(jobsError),
        );

        setLoading(false);
        return;
      }

      const jobMap = new Map((jobs || []).map((j) => [j.id, j]));
      const merged = appRows.map((r) => ({
        id: r.id,
        appliedAt: r.appliedat,
        job: jobMap.get(r.jobid) || null,
      }));

      setApplications(merged);
      setLoading(false);
    };

    fetchApplications();
  }, [router]);

  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-gray-700 ${
        isMenuOpen ? 'h-screen overflow-hidden md:h-auto md:overflow-auto' : ''
      }`}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <h1 className="mb-6 text-3xl font-bold text-blue-800">応募一覧</h1>

        {loading ? (
          <div className="py-10 text-center">読み込み中です</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : applications.length === 0 ? (
          <div className="py-10 text-center text-gray-600">
            応募履歴はありません。
          </div>
        ) : (
          <section aria-label="応募一覧">
            {applications.map((app) => (
              <article
                key={app.id}
                className="mb-6 flex flex-col items-start gap-6 rounded-lg bg-white p-6 shadow-md md:flex-row"
              >
                <div className="relative h-40 w-full flex-shrink-0 md:w-56">
                  <Image
                    src={app.job?.imageurl || FALLBACK_IMAGE_URL}
                    alt={app.job?.jobtitle || '応募求人'}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-grow md:pt-6">
                  <h2 className="mb-1 text-2xl font-bold text-blue-800">
                    {app.job?.jobtitle ?? '求人タイトル未設定'}
                  </h2>
                  <p className="mb-2 text-lg font-bold text-gray-700">
                    {app.job?.companyname ?? '会社名未設定'}
                  </p>
                  <p className="text-sm text-gray-500">
                    応募日:{' '}
                    {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
