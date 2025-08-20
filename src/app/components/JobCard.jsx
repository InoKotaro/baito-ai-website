'use client';
import Image from 'next/image';
import Link from 'next/link';

import ApplyButton from '@/app/components/ApplyButton';

// 画像が設定されていない場合の代替画像のパス
const FALLBACK_IMAGE_URL = '/images/no-image.jpg';

export default function JobCard({ jobs }) {
  return (
    <section aria-label="求人一覧">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="mb-6 flex flex-col items-start gap-6 rounded-lg bg-white p-6 shadow-md md:flex-row"
        >
          <div className="relative h-48 w-full flex-shrink-0 md:w-72">
            <Image
              src={job.imageurl || FALLBACK_IMAGE_URL}
              alt={job.jobtitle}
              fill
              className="rounded-md object-cover"
            />
          </div>

          <div className="flex-grow md:pt-1">
            {/* 路線、職種 */}
            <div className="mb-2 flex gap-3 text-sm font-semibold text-gray-600">
              <p>
                路線: {job.line?.railwayCompany?.railwayCompanyName ?? ''}{' '}
                {job.line?.lineName ?? '未設定'}
              </p>
              <p>職種: {job.occupation?.occupationName ?? '未設定'}</p>
            </div>

            <h2 className="mb-1 text-2xl font-bold text-blue-800">
              {job.jobtitle}
            </h2>
            <h3 className="text-1xl mb-2 font-bold text-gray-700">
              {job.companyname}
            </h3>

            <p className="text-lg font-bold text-red-600">
              時給: {job.hourlywage?.toLocaleString() ?? 'N/A'}円～
            </p>
            <p className="text-lg font-bold text-blue-800">
              勤務時間: {job.workinghours ?? 'N/A'}
            </p>
          </div>

          <div className="flex w-full justify-center gap-4 md:ml-auto md:w-auto md:flex-col md:pt-16">
            <Link
              href={`/jobs/${job.id}`}
              className="whitespace-nowrap rounded-lg bg-blue-500 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-blue-600"
            >
              詳細を見る
            </Link>
            <ApplyButton jobId={job.id} />
          </div>
        </article>
      ))}
    </section>
  );
}
