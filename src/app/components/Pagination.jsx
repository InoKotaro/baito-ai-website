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

  // 表示するページ番号を計算
  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // 5ページ以下の場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 現在のページを中心とした5ページを表示
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + 2);

      // 最後のページが表示範囲に含まれない場合は調整
      if (end === totalPages) {
        start = Math.max(1, end - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="mt-8 flex justify-center" aria-label="Page navigation">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ＜
          </button>
        </li>

        {/* 最初のページが表示範囲に含まれない場合、省略記号を表示 */}
        {visiblePages[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => paginate(1)}
                className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                1
              </button>
            </li>
            {visiblePages[0] > 2 && (
              <li className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500">
                ...
              </li>
            )}
          </>
        )}

        {/* 表示範囲内のページ番号 */}
        {visiblePages.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`border border-gray-300 px-3 py-2 leading-tight ${
                currentPage === number
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* 最後のページが表示範囲に含まれない場合、省略記号を表示 */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <li className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500">
                ...
              </li>
            )}
            <li>
              <button
                onClick={() => paginate(totalPages)}
                className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ＞
          </button>
        </li>
      </ul>
    </nav>
  );
}
