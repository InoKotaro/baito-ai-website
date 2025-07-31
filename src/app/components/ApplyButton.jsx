'use client';

import { useRouter } from 'next/navigation';

export default function ApplyButton({ jobId }) {
  const router = useRouter();

  const handleApplyClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/apply/${jobId}`);
  };

  return (
    <button
      onClick={handleApplyClick}
      className="rounded-lg bg-orange-500 px-8 py-4 font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
    >
      応募する
    </button>
  );
}
