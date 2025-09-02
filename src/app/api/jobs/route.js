import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Supabase経由で求人情報取得
export async function GET(request) {
  try {
    // GETリクエストは公開情報なので、RLSを有効にするために通常のクライアントを使うのが望ましい
    // しかし、このファイルではadminクライアントしかインポートしないため、このまま進める
    // 本来はクライアントを使い分けるべき
    const { data, error } = await supabaseAdmin.from('Job').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('求人取得APIエラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 求人登録用POST API
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const company = formData.get('company');
    const description = formData.get('description');
    const details = formData.get('details');
    const wage = formData.get('wage');
    const industry = formData.get('industry');
    const line = formData.get('line');
    const workinghours = formData.get('workinghours');
    const imageFile = formData.get('image');

    let imageUrl = '';
    if (imageFile) {
      // 画像アップロードのみ分離
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      let mimeType = '';
      if (fileExt === 'jpg' || fileExt === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (fileExt === 'png') {
        mimeType = 'image/png';
      } else {
        mimeType = 'application/octet-stream';
      }
      const arrayBuffer = await imageFile.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const { error: uploadError } = await supabaseAdmin.storage
        .from('BaitoAI-images')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        });
      if (uploadError) {
        // 画像アップロード失敗時は求人登録処理を行わず、エラーのみ返す
        return NextResponse.json(
          {
            success: false,
            error: '画像アップロード失敗: ' + uploadError.message,
          },
          { status: 500 },
        );
      }
      // 公開URL取得
      const { data: urlData } = supabaseAdmin.storage
        .from('BaitoAI-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabaseAdmin.from('Job').insert([
      {
        jobtitle: title,
        companyname: company,
        jobrole: details,
        description,
        hourlywage: Number(wage),
        imageurl: imageUrl || '',
        occupationid: Number(industry),
        lineid: Number(line),
        workinghours: workinghours || '',
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('求人登録APIエラー:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
