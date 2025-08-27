export default function SearchBar({
  lines = [],
  wages = [],
  occupations = [],
}) {
  return (
    <form
      className="flex flex-wrap items-end justify-center gap-4 rounded-md bg-white p-6 shadow"
      aria-label="求人検索フォーム"
    >
      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="line" className="mb-1 text-sm font-semibold">
          路線
        </label>
        <select
          id="line"
          name="line"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          {/* RailwayCompanyごとにoptgroupで分ける */}
          {(() => {
            // lines: [{id, lineName, railwayCompany: {id, name}}]
            // railwayCompanyIdごとにグループ化
            const grouped = {};
            lines.forEach((line) => {
              const company = line.RailwayCompany;
              if (!company) return;
              if (!grouped[company.id])
                grouped[company.id] = { name: company.name, lines: [] };
              grouped[company.id].lines.push(line);
            });
            return Object.values(grouped).map((group) => (
              <optgroup key={group.name} label={group.name}>
                {group.lines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.linename}
                  </option>
                ))}
              </optgroup>
            ));
          })()}
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="wage" className="mb-1 text-sm font-semibold">
          時給
        </label>
        <select
          id="wage"
          name="wage"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          {wages.map((wage) => (
            <option key={wage.id} value={wage.value}>
              {wage.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="occupation" className="mb-1 text-sm font-semibold">
          業種
        </label>
        <select
          id="occupation"
          name="occupation"
          className="rounded border border-gray-300 px-2 py-2 text-base"
        >
          <option value="">選択してください</option>
          {occupations.map((occ) => (
            <option key={occ.id} value={occ.id}>
              {occ.occupationname}
            </option>
          ))}
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
