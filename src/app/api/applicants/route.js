import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        user: true, // ユーザー情報を含める
        job: true, // 求人情報を含める
      },
      orderBy: {
        appliedAt: 'desc', // 新しい応募順にソート
      },
    });

    // フロントエンドが期待する形式にデータを変換
    const formattedApplicants = applications.map((app) => ({
      id: app.id,
      name: app.user.name,
      email: app.user.email,
      appliedDate: new Date(app.appliedAt).toLocaleDateString('ja-JP'),
      jobTitle: app.job.jobTitle,
      companyName: app.job.companyName,
    }));

    return NextResponse.json(formattedApplicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: '応募者情報の取得に失敗しました。' },
      { status: 500 },
    );
  }
}
