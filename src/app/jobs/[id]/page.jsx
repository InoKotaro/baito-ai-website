import Image from 'next/image';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { jobs } from '@/data/siteData';

// 求人データをIDで検索するヘルパー関数
const getJobById = (id) => {
  // URLのパラメータは文字列なので数値に変換します
  const numericId = parseInt(id, 10);
  return jobs.find((job) => job.id === numericId);
};

export default function JobDetailPage({ params }) {
  const { id } = params;
  const job = getJobById(id);

  // IDに対応する求人が見つからない場合は404ページを表示
  if (!job) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-700">
      <Header />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <article className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex flex-col items-start gap-6 md:flex-row">
            <div className="relative h-48 w-full flex-shrink-0 md:w-72">
              <Image
                src={job.image}
                alt={job.title}
                fill
                className="rounded-md object-contain"
              />
            </div>
            <div className="flex-grow">
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
            <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
              仕事内容
            </h2>
            <p className="whitespace-pre-line text-gray-700">
              {job.description}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
