'use client';

import { useState } from 'react';

import ApplicantCard from './ApplicantCard';
import Pagination from './Pagination';

export default function ApplicantListPageClient({
  applicants: initialApplicants,
}) {
  const [applicants] = useState(initialApplicants);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(5); // 1ページあたりの表示件数

  // ページネーションのロジック
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = applicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant,
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nextPage = () => paginate(currentPage + 1);
  const prevPage = () => paginate(currentPage - 1);

  return (
    <div>
      {applicants.length > 0 ? (
        <>
          <div>
            {currentApplicants.map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
          <Pagination
            jobsPerPage={applicantsPerPage}
            totalJobs={applicants.length}
            paginate={paginate}
            currentPage={currentPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </>
      ) : (
        <div className="py-10 text-center text-gray-500">
          該当する応募者はいません。
        </div>
      )}
    </div>
  );
}
