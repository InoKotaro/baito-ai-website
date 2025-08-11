'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <button
      type="button"
      onClick={handleBackClick}
      className="whitespace-nowrap rounded-lg bg-gray-300 px-8 py-3 font-bold text-gray-800 transition-colors hover:bg-gray-400"
    >
      戻る
    </button>
  );
}
