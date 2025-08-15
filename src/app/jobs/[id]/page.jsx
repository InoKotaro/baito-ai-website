import Image from 'next/image';
import { notFound } from 'next/navigation';

import ApplyButton from '@/app/components/ApplyButton';
import BackButton from '@/app/components/BackButton';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

// 画像が設定されていない場合の代替画像のパス
const FALLBACK_IMAGE_URL = '/images/no-image.jpg';

// 求人データをIDで検索するヘルパー関数
const getJobById = async (id) => {
  // URLパラメータ文字列を数値に変換
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return null;
  }

  const { data, error } = await supabase
    .from('Job')
    .select(
      '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename)',
    )
    .eq('id', numericId)
    .single();

  if (error) {
    console.error('Error fetching job by id:', {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    return null;
  }
  return data;
};

export default async function JobDetailPage({ params }) {
  const { id } = params;
  const job = await getJobById(id);

  // IDに対応する求人がない際は404ページを表示
  if (!job) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <article className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 border-b pb-4 text-3xl font-bold text-blue-800">
            求人詳細
          </h1>
          <div className="mb-6 flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-48 w-72 flex-shrink-0 md:w-72">
              <Image
                src={job.imageurl || FALLBACK_IMAGE_URL}
                alt={job.jobtitle}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-grow md:mt-4">
              <div className="text-center md:text-start">
                <h1 className="mb-2 text-2xl font-bold text-blue-800">
                  {job.jobtitle}
                </h1>
                <h1 className="mb-2 text-lg font-bold text-blue-800">
                  {job.companyname}
                </h1>
              </div>
              <p className="mb-4 text-lg font-semibold">{job.jobRole}</p>
              <p className="text-base">
                <strong>時給:</strong>{' '}
                {job.hourlywage?.toLocaleString() ?? 'N/A'}円～
                <br />
                <strong>勤務時間:</strong> {job.workinghours ?? 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-4 border-b pb-3 text-2xl font-semibold">
              仕事内容
            </h2>
            <p className="whitespace-pre-line text-gray-700">
              {job.description ?? '詳細な仕事内容はありません。'}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <BackButton />
            <ApplyButton jobId={job.id} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
