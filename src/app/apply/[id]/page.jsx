'use client';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
    .select(
      '*, occupation:Occupation(occupationName:occupationname), line:Line(lineName:linename, railwayCompany:RailwayCompany(railwayCompanyName:name))',
    )
    .eq('id', numericId)
    .single();

  if (error) {
    console.error('Error fetching job by id:', JSON.stringify(error, null, 2));
    return null;
  }
  return data;
};

export default function ApplyPage({ params }) {
  const { id } = React.use(params);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchJob = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const jobData = await getJobById(id);
      if (!jobData) {
        notFound();
      } else {
        setJob(jobData);
      }
      setLoading(false);
    };

    checkAuthAndFetchJob();
  }, [id, router]);

  const handleApplyClick = async () => {
    if (!job) return;
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // アプリ内ユーザー（整数ID）を取得。なければ作成。
    const { data: dbUser, error: dbUserError } = await supabase
      .from('User')
      .select('id')
      .eq('email', user.email)
      .single();

    let appUserId = dbUser?.id;

    if (dbUserError || !dbUser) {
      const fallbackName =
        user.user_metadata?.full_name ||
        (user.email ? user.email.split('@')[0] : 'ユーザー');

      const { data: insertedUser, error: insertUserError } = await supabase
        .from('User')
        .insert({ email: user.email, name: fallbackName })
        .select('id')
        .single();

      if (insertUserError || !insertedUser) {
        console.error(
          'Error creating app user:',
          JSON.stringify(insertUserError || {}),
        );
        alert('ユーザー情報の作成に失敗しました。');
        setIsSubmitting(false);
        return;
      }
      appUserId = insertedUser.id;
    }

    const { error } = await supabase
      .from('JobApplication')
      .insert({ userid: appUserId, jobid: job.id });

    // 一意制約エラー（重複応募）は成功扱い
    if (error && error.code !== '23505') {
      console.error('Error inserting application:', error);
      alert('応募の保存に失敗しました。時間をおいて再度お試しください。');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/applications');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-600"></p>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-gray-700 ${
        isMenuOpen ? 'h-screen overflow-hidden md:h-auto md:overflow-auto' : ''
      }`}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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
                {/* 路線、職種 */}
                <div className="mb-2 flex gap-3 text-sm font-semibold text-gray-600">
                  <p>
                    路線: {job.line?.railwayCompany?.railwayCompanyName ?? ''}{' '}
                    {job.line?.lineName ?? '未設定'}
                  </p>
                  <p>職種: {job.occupation?.occupationName ?? '未設定'}</p>
                </div>

                <h2 className="text-2xl font-bold text-blue-800">
                  {job.jobtitle}
                </h2>
                <p className="mb-4 text-lg font-bold text-blue-800">
                  {job.companyname}
                </p>
                <p className="text-start text-base">
                  <strong>職種:</strong>{' '}
                  {job.occupation?.occupationName ?? '未設定'}
                  <br />
                  <strong>路線:</strong>{' '}
                  {job.line?.railwayCompany?.railwayCompanyName ?? ''}{' '}
                  {job.line?.lineName ?? '未設定'}
                  <br />
                  <strong>時給:</strong>{' '}
                  {job.hourlywage?.toLocaleString() ?? 'N/A'}円～
                  <br />
                  <strong>勤務時間:</strong> {job.workinghours ?? 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-8 text-center">
            上記の求人に応募します。
            <br className="block md:hidden" />
            よろしいですか？
          </p>

          <div className="flex justify-center gap-4">
            {/* 戻るボタン */}
            <BackButton />
            <button
              onClick={handleApplyClick}
              disabled={isSubmitting}
              className={`whitespace-nowrap rounded-lg px-8 py-4 font-bold text-white transition-colors ${
                isSubmitting
                  ? 'cursor-not-allowed bg-orange-300'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? '送信中' : '応募を確定する'}
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
