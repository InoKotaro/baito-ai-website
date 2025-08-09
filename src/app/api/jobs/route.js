import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Prismaを使ってデータベースから求人情報をすべて取得
    const jobs = await prisma.job.findMany();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    // エラー発生時は、500エラーステータスとエラーメッセージを返す
    return new NextResponse(
      JSON.stringify({ error: 'データベースからのデータ取得に失敗しました。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
