export default function StickySearchBar() {
  return (
    <section
      className="flex flex-wrap items-center justify-center gap-2 rounded-md bg-white/90 p-2 shadow-sm backdrop-blur-sm"
      aria-label="求人検索"
    >
      <select
        id="sticky-railway"
        name="railway"
        className="min-w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm"
        aria-label="路線"
      >
        <option value="">路線を選択</option>
        <option value="JR">JR線</option>
        <option value="TokyoMetro">東京メトロ</option>
        <option value="Private">私鉄</option>
      </select>

      <input
        type="number"
        id="sticky-wage"
        name="wage"
        placeholder="時給 (最低)"
        min="800"
        max="2000"
        className="min-w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm"
        aria-label="時給（最低）"
      />

      <select
        id="sticky-jobCategory"
        name="jobCategory"
        className="min-w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm"
        aria-label="職種"
      >
        <option value="">職種を選択</option>
        <option value="convenience">コンビニ</option>
        <option value="restaurant">飲食店</option>
        <option value="retail">販売</option>
      </select>

      <button
        type="submit"
        className="rounded-md bg-orange-500 px-6 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
      >
        検索
      </button>
    </section>
  );
}

