export default function SearchBar({ railwayCompanies = [] }) {
  return (
    <form
      className="flex flex-wrap items-end justify-center gap-4 rounded-md bg-white p-6 shadow"
      aria-label="求人検索フォーム"
    >
      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="railway" className="mb-1 text-sm font-semibold">
          路線
        </label>
        <select
          id="railway"
          name="railway"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          {railwayCompanies.map((company) => (
            <optgroup label={company.name} key={company.id}>
              {company.lines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.lineName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="wage" className="mb-1 text-sm font-semibold">
          時給（最低）
        </label>
        <select
          id="wage"
          name="wage"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          <option value="￥900">900円～</option>
          <option value="￥1000">1000円～</option>
          <option value="￥1100">1100円～</option>
          <option value="￥1200">1200円～</option>
          <option value="￥1300">1300円～</option>
          <option value="￥1400">1400円～</option>
          <option value="￥1500">1500円～</option>
          <option value="￥2000">2000円～</option>
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="jobCategory" className="mb-1 text-sm font-semibold">
          職種
        </label>
        <select
          id="jobCategory"
          name="jobCategory"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          <option value="convenience">コンビニスタッフ</option>
          <option value="restaurant">飲食店スタッフ</option>
          <option value="retail">販売スタッフ</option>
        </select>
      </div>

      {/* 検索ボタン */}
      <button
        type="submit"
        className="rounded-md bg-orange-500 px-8 py-2 font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
      >
        検索
      </button>
    </form>
  );
}
