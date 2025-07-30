import Image from 'next/image';
import { notFound } from 'next/navigation';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { jobs } from '@/data/siteData';

const getJobById = (id) => {
  const numericId = parseInt(id, 10);
  return jobs.find((job) => job.id === numericId);
};

export default function ApplyPage({ params }) {
  const { id } = params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-700">
      <Header />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 border-b pb-4 text-3xl font-bold text-blue-800">
            応募内容の確認
          </h1>

          <div className="mb-8 flex items-center gap-6">
            <div className="relative h-48 w-72 flex-shrink-0">
              <Image
                src={job.image}
                alt={job.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-800">{job.title}</h2>
              <p className="text-lg font-bold text-blue-800">{job.company}</p>
              <p className="mt-2">
                時給: {job.wage}
                <br />
                勤務時間: {job.hours}
              </p>
            </div>
          </div>

          <p className="mb-8">上記の内容で応募します。よろしいですか？</p>

          <div className="flex justify-end gap-4">
            <button className="rounded-lg bg-gray-300 px-8 py-3 font-bold text-gray-800 transition-colors hover:bg-gray-400">
              戻る
            </button>
            <button className="rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600">
              応募を確定する
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
