'use client';

export default function Pagination({
  jobsPerPage,
  totalJobs,
  paginate,
  currentPage,
  prevPage,
  nextPage,
}) {
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  return (
    <nav className="mt-8 flex justify-center" aria-label="Page navigation">
      <ul className="inline-flex items-center -space-x-px">
        {/* 前のページボタン */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ＜
        </button>

        {/* ページ番号ボタン */}
        <div className="flex min-w-[200px] items-center justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // 表示するページ番号を制限（現在のページ周辺のみ表示）
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2);

            if (!showPage) {
              // 省略記号を表示
              if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="px-2 py-2 text-gray-500">
                    ～
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`mx-1 border border-gray-300 px-3 py-2 leading-tight ${
                  currentPage === page
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 次のページボタン */}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ＞
        </button>
      </ul>
    </nav>
  );
}
