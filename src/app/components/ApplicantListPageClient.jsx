'use client';

import { useState } from 'react';

import ApplicantCard from './ApplicantCard';

export default function ApplicantListPageClient({
  applicants: initialApplicants,
}) {
  const [applicants] = useState(initialApplicants);

  return (
    <div>
      {applicants.length > 0 ? (
        <div>
          {applicants.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">
          該当する応募者はいません。
        </div>
      )}
    </div>
  );
}
