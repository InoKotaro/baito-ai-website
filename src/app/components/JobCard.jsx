'use client';
import Image from 'next/image';
import Link from 'next/link';

import LinkApplyButton from '@/app/components/ApplyButton';

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
              src={job.imageUrl || FALLBACK_IMAGE_URL}
              alt={job.jobTitle}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-grow md:pt-1">
            <p className="mb-2 text-sm text-gray-500">
              {/* 関連データが存在する場合のみ安全に表示 */}
              {[job.occupation?.occupationName, job.line?.lineName]
                .filter(Boolean)
                .join(' / ')}
            </p>
            <h2 className="mb-1 text-2xl font-bold text-blue-800">
              {job.jobTitle}
            </h2>
            <h3 className="text-1xl mb-2 font-bold text-gray-700">
              {job.companyName}
            </h3>
            <p className="mb-4 font-semibold text-gray-700">{job.jobRole}</p>
            <p className="text-lg font-bold text-red-600">
              時給: {job.hourlyWage?.toLocaleString() ?? 'N/A'}円～
            </p>
            <p className="text-lg font-bold text-blue-800">
              勤務時間: {job.workingHours ?? 'N/A'}
            </p>
          </div>

          <div className="flex w-full justify-center gap-4 md:ml-auto md:w-auto md:flex-col md:pt-16">
            <Link
              href={`/jobs/${job.id}`}
              className="whitespace-nowrap rounded-lg bg-blue-500 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-blue-600"
            >
              詳細を見る
            </Link>
            <LinkApplyButton jobId={job.id} />
          </div>
        </article>
      ))}
    </section>
  );
}
