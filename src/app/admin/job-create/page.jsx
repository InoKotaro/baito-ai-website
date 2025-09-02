'use client';

import { useEffect, useState } from 'react';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    details: '',
    wage: '',
    industry: '',
    line: '',
    workinghours: '',
  });

  // DBから選択肢取得
  const { lines, wages, occupations, loading } =
    require('@/app/hooks/useSearchOptions').default();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { admin } = useAdminAuth();

  // admin情報が読み込まれたら、企業名フォームにデフォルト値を設定
  useEffect(() => {
    if (admin) {
      setFormData((prev) => ({
        ...prev,
        company: admin.name || admin.email || '',
      }));
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isJpg = ext === 'jpg' || ext === 'jpeg';
      const isPng = ext === 'png';
      if (
        (isJpg && file.type === 'image/jpeg') ||
        (isPng && file.type === 'image/png')
      ) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('JPGまたはPNG画像のみアップロード可能です。');
        setImageFile(null);
        setImagePreview('');
      }
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // API経由で画像と求人情報を送信
    const postJobWithImage = async () => {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('company', formData.company);
      form.append('description', formData.description);
      form.append('details', formData.details);
      form.append('wage', formData.wage);
      form.append('industry', formData.industry);
      form.append('line', formData.line);
      form.append('workinghours', formData.workinghours);

      if (imageFile) {
        form.append('image', imageFile);
      }
      try {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        if (data.success) {
          alert('求人を登録しました。');
          // フォームを初期状態にリセット
          setFormData((prev) => ({
            title: '',
            company: prev.company, // 企業名は維持
            description: '',
            details: '',
            wage: '',
            industry: '',
            line: '',
            workinghours: '',
          }));
          setImageFile(null);
          setImagePreview('');
        } else {
          alert('登録に失敗しました: ' + (data.error || '不明なエラー'));
        }
      } catch (err) {
        alert('登録時エラー: ' + err.message);
      }
    };
    postJobWithImage();
  };

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
        <Header />
        <main className="mx-auto mb-8 mt-8 w-full max-w-2xl flex-grow px-4">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">
              求人情報の登録
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 企業名 */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium">
                  企業名（自動で設定されます）
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  readOnly
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-0"
                />
              </div>

              {/* 職種 */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  職種
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：ホールスタッフ"
                />
              </div>

              {/* 仕事内容 */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  仕事内容
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：お客様のご案内、オーダー取り、配膳などをお願いします。"
                ></textarea>
              </div>

              {/* 詳細 */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium">
                  アピールポイント・詳細
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows="6"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  className="focus:ring-blue-500　 mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500"
                  placeholder={`例：未経験者歓迎！シフトは週2日から相談可能です。
　　美味しいまかない付き！`}
                ></textarea>
              </div>
              {/* 勤務時間 */}
              <div>
                <label
                  htmlFor="workinghours"
                  className="block text-sm font-medium"
                >
                  勤務時間
                </label>
                <input
                  type="text"
                  id="workinghours"
                  name="workinghours"
                  value={formData.workinghours}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：10:00〜18:00（シフト制）"
                />
              </div>

              {/* 画像アップロード */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  求人画像 (JPG, PNG)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">プレビュー:</p>
                    <img
                      src={imagePreview}
                      alt="プレビュー"
                      className="mt-2 h-48 w-auto rounded-md object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* 路線 */}
                <div>
                  <label htmlFor="line" className="block text-sm font-medium">
                    路線
                  </label>
                  <select
                    id="line"
                    name="line"
                    value={formData.line}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {lines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.linename}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 時給（入力）*/}
                <div>
                  <label htmlFor="wage" className="block text-sm font-medium">
                    時給
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="wage"
                      name="wage"
                      value={formData.wage}
                      onChange={handleChange}
                      min="0"
                      placeholder="例: 1200"
                      className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 業種 */}
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium"
                  >
                    業種
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {occupations.map((occ) => (
                      <option key={occ.id} value={occ.id}>
                        {occ.occupationname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600"
                >
                  この内容で登録する
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
