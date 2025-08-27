import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';

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
      // ファイル名生成
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      // MIMEタイプ推定
      const getMimeType = (ext) => {
        ext = ext.toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
        if (ext === 'png') return 'image/png';
        return 'application/octet-stream';
      };
      const mimeType = imageFile.type || getMimeType(fileExt);
      // Supabase Storageへアップロード
      const { data, error } = await supabase.storage
        .from('BaitoAI-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        });
      if (error) {
        throw new Error('画像アップロード失敗: ' + error.message);
      }
      // 公開URL取得
      const { data: urlData } = supabase.storage
        .from('BaitoAI-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('Job').insert([
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
