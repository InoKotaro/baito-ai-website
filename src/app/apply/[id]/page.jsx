'use client';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';

import BackButton from '@/app/components/BackButton';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

// 画像が設定されていない場合の代替画像のパス
const FALLBACK_IMAGE_URL = '/images/no-image.jpg';

// 求人データをIDで検索するヘルパー関数
const getJobById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return null;
  }

  // supabaseDBから求人取得
  const { data, error } = await supabase
    .from('Job')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error) {
    console.error('Error fetching job by id:', error);
    return null;
  }
  return data;
};

export default function ApplyPage({ params }) {
  const { id } = use(params);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await getJobById(id);
      if (!jobData) {
        notFound();
      } else {
        setJob(jobData);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-600"></p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 border-b pb-4 text-3xl font-bold text-blue-800">
            応募内容確認
          </h1>

          {/* mdサイズ以上で中央揃えにするラッパー */}
          <div className="md:flex md:justify-center">
            <div className="mb-8 flex flex-col items-center gap-6 text-center md:inline-flex md:flex-row md:text-left">
              <div className="relative h-48 w-72 flex-shrink-0 md:w-72">
                <Image
                  src={job.imageurl || FALLBACK_IMAGE_URL}
                  alt={job.jobtitle}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-blue-800">
                  {job.jobtitle}
                </h2>
                <p className="mb-4 text-lg font-bold text-blue-800">
                  {job.companyname}
                </p>
                <p className="text-start text-base">
                  <strong>時給:</strong>{' '}
                  {job.hourlywage?.toLocaleString() ?? 'N/A'}円～
                  <br />
                  <strong>勤務時間:</strong> {job.workinghours ?? 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-8 text-center">
            上記の求人に応募します。よろしいですか？
          </p>

          <div className="flex justify-center gap-4">
            {/* 戻るボタン */}
            <BackButton />
            <button
              onClick={handleApplyClick}
              className="whitespace-nowrap rounded-lg bg-orange-500 px-8 py-4 font-bold text-white transition-colors hover:bg-orange-600"
            >
              応募を確定する
            </button>
          </div>
        </div>
      </main>

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-3 w-full max-w-md rounded-lg bg-white p-7 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-blue-800">
              応募が完了しました
            </h3>
            <p className="mb-6 mt-4">
              ご応募ありがとうございました。
              <br />
              企業からの連絡をお待ちください。
            </p>
            <button
              onClick={handleCloseModal}
              className="rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600"
            >
              トップページへ戻る
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
