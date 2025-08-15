import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const lineId = formData.get('railway') || null;
    const wage = formData.get('wage') || null;
    const jobCategory = formData.get('jobCategory') || null;

    let query = supabase.from('job').select('*');

    if (lineId) query = query.eq('lineId', lineId);
    if (wage) query = query.gte('hourlyWage', parseInt(wage.replace('￥', '')));
    if (jobCategory) query = query.eq('jobRole', jobCategory);

    const { data, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: '検索に失敗しました' }), {
      status: 500,
    });
  }
}
