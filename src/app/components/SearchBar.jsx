export default function SearchBar() {
  return (
    <section
      className="mb-8 flex flex-wrap justify-center gap-4 rounded-md bg-white p-6 shadow"
      aria-label="求人検索"
    >
      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="railway" className="mb-1 text-sm font-semibold">
          路線
        </label>
        <select
          id="railway"
          name="railway"
          className="rounded border border-gray-300 px-2 py-1 text-base"
        >
          <option value="">選択してください</option>
          <option value="JR">JR線</option>
          <option value="TokyoMetro">東京メトロ</option>
          <option value="Private">私鉄</option>
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="wage" className="mb-1 text-sm font-semibold">
          時給（最低）
        </label>
        <input
          type="number"
          id="wage"
          name="wage"
          placeholder="1100"
          min="800"
          max="2000"
          className="rounded border border-gray-300 px-2 py-1 text-base"
        />
      </div>

      <div className="flex min-w-[120px] flex-col">
        <label htmlFor="jobCategory" className="mb-1 text-sm font-semibold">
          職種
        </label>
        <select
          id="jobCategory"
          name="jobCategory"
          className="rounded border border-gray-300 px-2 py-1 text-base"
        >
          <option value="">選択してください</option>
          <option value="convenience">コンビニスタッフ</option>
          <option value="restaurant">飲食店スタッフ</option>
          <option value="retail">販売スタッフ</option>
        </select>
      </div>
    </section>
  );
}
