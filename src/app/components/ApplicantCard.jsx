import React from 'react';

export default function ApplicantCard({ applicant }) {
  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow duration-200">
      <div className="flex items-start">
        <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-white">
          {applicant.name.charAt(0)}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 md:pt-2">
              {applicant.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500">{applicant.email}</p>
          <div className="text-right text-xs text-gray-400">
            応募日: {applicant.appliedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
