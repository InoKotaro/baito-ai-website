import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use } from 'react';

import ApplyButton from '@/app/components/ApplyButton';
import BackButton from '@/app/components/BackButton';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { jobs } from '@/data/siteData';

// 求人データをIDで検索するヘルパー関数
const getJobById = (id) => {
  // URLパラメータ文字列を数値に変換
  const numericId = parseInt(id, 10);
  return jobs.find((job) => job.id === numericId);
};

export default function JobDetailPage({ params }) {
  const { id } = use(params);
  const job = getJobById(id);

  // IDに対応する求人がない際は404ページを表示
  if (!job) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <article className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-48 w-72 flex-shrink-0 md:w-72">
              <Image
                src={job.image}
                alt={job.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-grow md:mt-4">
              <h1 className="mb-2 text-2xl font-bold text-blue-800">
                {job.title}
              </h1>
              <h1 className="text-1xl mb-2 font-bold text-blue-800">
                {job.company}
              </h1>
              <p className="mb-4 text-lg font-semibold">{job.summary}</p>
              <p className="text-base">
                <strong>時給:</strong> {job.wage}
                <br />
                <strong>勤務時間:</strong> {job.hours}
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-4 border-b pb-3 text-2xl font-semibold">
              仕事内容
            </h2>
            <p className="whitespace-pre-line text-gray-700">
              {job.description}
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
