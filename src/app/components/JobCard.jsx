'use client';
import Image from 'next/image';
import Link from 'next/link';

import LinkApplyButton from '@/app/components/ApplyButton';
import { jobs } from '@/data/siteData.jsx';

export default function JobCard() {
  return (
    <section aria-label="求人一覧">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="mb-6 flex items-start gap-6 rounded-lg bg-white p-6 shadow-md"
        >
          <div className="relative h-48 w-72 flex-shrink-0">
            <Image
              src={job.image}
              alt={job.title}
              fill
              className="rounded-md object-contain"
            />
          </div>
          <div className="flex-grow md:pt-5">
            <h2 className="mb-1 text-2xl font-bold text-blue-800">
              {job.title}
            </h2>
            <h2 className="text-1xl mb-1 font-bold text-blue-800">
              {job.company}
            </h2>
            <p className="mb-2 font-semibold">{job.summary}</p>
            <p className="text-sm">
              時給: {job.wage}
              <br />
              勤務時間: {job.hours}
            </p>
          </div>

          <div className="ml-auto flex flex-col items-center justify-center gap-4 self-stretch md:pt-9">
            <Link
              href={`/jobs/${job.id}`}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-center font-bold text-white transition-colors hover:bg-blue-600"
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
