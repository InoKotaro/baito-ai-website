import Image from 'next/image';
import Link from 'next/link';

import { jobs } from '@/data/siteData.jsx';

export default function JobCard() {
  return (
    <section aria-label="求人一覧">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="block">
          <article className="mb-6 flex cursor-pointer items-start gap-4 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="relative h-48 w-72 flex-shrink-0">
              <Image
                src={job.image}
                alt={job.title}
                fill
                className="rounded-md object-contain"
              />
            </div>
            <div>
              <h2 className="mb-1 text-2xl font-bold text-blue-800">
                {job.title}
              </h2>
              <h2 className="mb-1 text-1xl font-bold text-blue-800">
                {job.company}
              </h2>

              <p className="mb-2 font-semibold">{job.summary}</p>
              <p className="mb-4 whitespace-pre-line text-sm text-gray-600">
                {job.description}
              </p>
              <p className="text-sm">
                時給: {job.wage}
                <br />
                勤務時間: {job.hours}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </section>
  );
}
