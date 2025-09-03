'use client';

import { useRouter } from 'next/navigation';

import ApplicantCard from './ApplicantCard';
import Pagination from './Pagination';

export default function ApplicantListPageClient({
  applicants = [],
  currentPage = 1,
  totalApplicants = 0,
  applicantsPerPage = 5,
  onPageChange,
}) {
  const router = useRouter();

  const paginate = (pageNumber) => {
    if (onPageChange) {
      onPageChange(pageNumber);
    } else {
      router.push(`/admin/applicants?page=${pageNumber}`);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(totalApplicants / applicantsPerPage)) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

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

      {totalApplicants > applicantsPerPage && (
        <Pagination
          jobsPerPage={applicantsPerPage}
          totalJobs={totalApplicants}
          paginate={paginate}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}
