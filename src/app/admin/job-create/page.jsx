'use client';

import { useEffect, useState } from 'react';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    details: '',
    wage: '',
    industry: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // 時給と業種の選択肢
  const wageOptions = [
    '1000円',
    '1100円',
    '1200円',
    '1300円',
    '1400円',
    '1500円以上',
  ];
  const industryOptions = [
    '飲食',
    '販売',
    'サービス',
    'IT',
    '軽作業',
    'その他',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImageFile(file);
      // プレビュー用のURLを生成
      setImagePreview(URL.createObjectURL(file));
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

    // ファイルを含むフォームデータ送信に伴い、FormDataオブジェクト使用
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    if (imageFile) {
      submissionData.append('image', imageFile, imageFile.name);
    }

    // ここでバックエンドAPIへ submissionData 送信
    console.log(
      '登録する求人情報:',
      Object.fromEntries(submissionData.entries()),
    );
    alert('求人を登録しました。');
    // 登録成功後、企業向けダッシュボードなどにリダイレクトする場合は
    // useRouter() を使用します。
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
                  企業名・店舗名
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：株式会社デリッシュAI"
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
                  placeholder="例：【ホールスタッフ】"
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
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例：未経験者歓迎！シフトは週2日から相談可能です。美味しいまかない付き！"
                ></textarea>
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 時給 */}
                <div>
                  <label htmlFor="wage" className="block text-sm font-medium">
                    時給
                  </label>
                  <select
                    id="wage"
                    name="wage"
                    value={formData.wage}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {wageOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
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
                    {industryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
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
