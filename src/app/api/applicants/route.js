import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const offset = (page - 1) * limit;

    // 応募者情報を取得（求人とユーザー情報を含む）
    const { data, error, count } = await supabaseAdmin
      .from('JobApplication')
      .select(
        `
        id,
        appliedat,
        user:User(name, email),
        job:Job(jobtitle, companyname)
      `,
        { count: 'exact' },
      )
      .order('appliedat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('応募者取得エラー:', error);
      return NextResponse.json(
        { success: false, error: '応募者情報の取得に失敗しました' },
        { status: 500 },
      );
    }

    // フロントエンドが期待する形式にデータを変換
    const formattedApplicants = (data || []).map((app) => ({
      id: app.id,
      name: app.user?.name || '名前不明',
      email: app.user?.email || 'メール不明',
      appliedDate: new Date(app.appliedat).toLocaleDateString('ja-JP'),
      jobTitle: app.job?.jobtitle || '求人タイトル不明',
      companyName: app.job?.companyname || '企業名不明',
    }));

    return NextResponse.json({
      success: true,
      applicants: formattedApplicants,
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('応募者取得APIエラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
