'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

export default function MyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);

  const [name, setName] = useState('');

  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: existing, error: fetchErr } = await supabase
        .from('User')
        .select('id, name, email')
        .eq('email', user.email)
        .single();

      let current = existing;
      if (fetchErr || !existing) {
        const fallbackName =
          user.user_metadata?.full_name ||
          (user.email ? user.email.split('@')[0] : 'ユーザー');
        const { data: created, error: createErr } = await supabase
          .from('User')
          .insert({ name: fallbackName, email: user.email, password: '' })
          .select('id, name, email')
          .single();
        if (createErr || !created) {
          setLoading(false);
          return;
        }
        current = created;
      }

      setDbUser(current);
      setName(current.name || '');
      setLoading(false);
    };
    init();
  }, [router]);

  const handleUpdateName = async () => {
    if (!dbUser) return;
    setBusy(true);
    setError('');
    setInfo('');
    const { error } = await supabase
      .from('User')
      .update({ name })
      .eq('id', dbUser.id);
    if (error) {
      setError('名前の更新に失敗しました。');
    } else {
      // ヘッダーが参照する user_metadata.full_name も更新
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { full_name: name },
      });
      if (metaErr) {
        console.error('Failed to update auth user metadata:', metaErr);
      }
      setInfo('名前を更新しました。');
      setDbUser({ ...dbUser, name });
    }
    setBusy(false);
  };

  // メール・パスワード変更機能は削除

  const handleDeleteAccount = async () => {
    if (!dbUser) return;
    if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。'))
      return;
    setBusy(true);
    setError('');
    setInfo('');

    const { error: delAppsErr } = await supabase
      .from('JobApplication')
      .delete()
      .eq('userid', dbUser.id);
    if (delAppsErr) {
      setBusy(false);
      return;
    }

    const { error: delUserErr } = await supabase
      .from('User')
      .delete()
      .eq('id', dbUser.id);
    if (delUserErr) {
      console.error('Delete User error:', delUserErr);

      setBusy(false);
      return;
    }

    // 認証ユーザー自体を削除（管理API経由）→ その後サインアウト
    try {
      const authUserId = user?.id;
      if (authUserId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        const res = await fetch('/api/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ authUserId }),
        });

        if (!res.ok) {
          // エラーはUIには出さずに処理継続（既にアプリDB側は削除済みのため）
          try {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              await res.json();
            } else {
              await res.text();
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.error('Delete auth user API call error:', e);
    }

    await supabase.auth.signOut();
    setInfo('アカウントを削除しました。');
    router.replace('/login');
  };

  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-gray-700 ${
        isMenuOpen ? 'h-screen overflow-hidden md:h-auto md:overflow-auto' : ''
      }`}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <h1 className="mb-6 text-3xl font-bold text-blue-800">マイページ</h1>
        {loading ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            読み込み中
          </div>
        ) : (
          <div className="space-y-6">
            {(info || error) && (
              <div
                className={`rounded-md p-4 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
              >
                {error || info}
              </div>
            )}

            <section className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-blue-800">
                プロフィール
              </h2>
              <label className="mb-2 block text-sm text-gray-600">名前</label>
              <input
                type="text"
                className="mb-4 w-full rounded border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleUpdateName}
                  disabled={busy}
                  className={`rounded bg-orange-500 px-6 py-2 font-bold text-white ${busy ? 'opacity-60' : 'hover:bg-orange-600'}`}
                >
                  {busy ? '保存中' : '保存'}
                </button>
              </div>
            </section>

            {/* メール・パスワード変更機能は削除 */}

            <section className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-red-700">
                アカウント削除
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                応募データを含むアカウント情報を削除します。
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleDeleteAccount}
                  disabled={busy}
                  className={`rounded bg-red-600 px-6 py-2 font-bold text-white ${busy ? 'opacity-60' : 'hover:bg-red-700'}`}
                >
                  アカウントを削除
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
