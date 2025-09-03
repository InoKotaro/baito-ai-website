import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

// 特定の求人を削除
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '求人IDが必要です' },
        { status: 400 },
      );
    }

    // 求人情報を取得（画像URLを取得するため）
    const { data: jobData, error: fetchError } = await supabaseAdmin
      .from('Job')
      .select('imageurl')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: '求人が見つかりません' },
        { status: 404 },
      );
    }

    // 求人を削除
    const { error: deleteError } = await supabaseAdmin
      .from('Job')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        {
          success: false,
          error: '求人の削除に失敗しました: ' + deleteError.message,
        },
        { status: 500 },
      );
    }

    // 画像が存在する場合はストレージからも削除
    if (jobData.imageurl) {
      try {
        // URLからファイル名を抽出
        const urlParts = jobData.imageurl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        if (fileName) {
          const { error: storageError } = await supabaseAdmin.storage
            .from('BaitoAI-images')
            .remove([fileName]);

          if (storageError) {
            console.warn('画像の削除に失敗しました:', storageError.message);
            // 画像削除の失敗は求人削除の成功を妨げない
          }
        }
      } catch (storageError) {
        console.warn('画像削除処理でエラー:', storageError);
        // 画像削除の失敗は求人削除の成功を妨げない
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('求人削除APIエラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}

// 特定の求人情報を取得
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '求人IDが必要です' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('Job')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: '求人が見つかりません' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, job: data });
  } catch (error) {
    console.error('求人取得APIエラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
}
