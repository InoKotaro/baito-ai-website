import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// サーバー専用キーでクライアント作成（サービスロールキー必須）
const supabase = createClient(
  process.env.SUPABASE_URL, // サーバー用 URL
  process.env.SUPABASE_SERVICE_ROLE_KEY, // サービスロールキー
);

export async function GET() {
  try {
    let deletedUsers = 0;
    let deletedJobs = 0;
    let deletedFiles = 0; // 追加
    let remainingUsers = null;

    console.log('=== クリーンアップ処理開始 ===');
    console.log('環境変数確認:');
    console.log(
      'process.env:',
      Object.keys(process.env).filter((key) => key.includes('SUPABASE')),
    );
    console.log(
      'SUPABASE_URL:',
      process.env.SUPABASE_URL ? '設定済み' : '未設定',
    );
    if (process.env.SUPABASE_URL) {
      console.log('  URL:', process.env.SUPABASE_URL);
    } else {
      console.log('  SUPABASE_URL が未設定です');
    }
    console.log(
      'SUPABASE_SERVICE_ROLE_KEY:',
      process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定',
    );
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log(
        '  キーの長さ:',
        process.env.SUPABASE_SERVICE_ROLE_KEY.length,
      );
      console.log(
        '  キーの先頭:',
        process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...',
      );
    } else {
      console.log('  SUPABASE_SERVICE_ROLE_KEY が未設定です');
    }

    // Supabaseクライアントの接続テスト
    try {
      const { data: testData, error: testError } =
        await supabase.auth.admin.listUsers({ perPage: 1 });
      if (testError) {
        console.error('Supabase接続テスト失敗:', testError);
        throw new Error(`Supabase接続エラー: ${testError.message}`);
      } else {
        console.log('Supabase接続テスト成功');
      }
    } catch (connectionError) {
      console.error('Supabase接続テスト例外:', connectionError);
      throw connectionError;
    }

    // -------------------------------
    // 1. Supabase Auth 全ユーザー取得と削除
    // -------------------------------

    try {
      // ページネーションを使用して全ユーザーを取得
      let allUsers = [];
      let page = 1;
      const pageSize = 100;
      let hasMore = true;

      while (hasMore) {
        const {
          data: { users },
          error,
        } = await supabase.auth.admin.listUsers({
          page,
          perPage: pageSize,
        });

        if (error) {
          console.error(`ページ ${page} のユーザー取得エラー:`, error);
          break;
        }

        if (!users || users.length === 0) {
          console.log(`ページ ${page}: ユーザーなし`);
          break;
        }

        console.log(`ページ ${page}: ${users.length}件のユーザーを取得`);
        allUsers = allUsers.concat(users);
        hasMore = users.length === pageSize;
        page++;
      }

      console.log(`総ユーザー数: ${allUsers.length}`);

      // 作成日時でユーザーをソート（古い順）
      allUsers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      if (allUsers.length > 0) {
        console.log('全ユーザー情報 (作成日時順):');
        allUsers.forEach((user, index) => {
          console.log(
            `  ${index + 1}. ID: ${user.id}, Email: ${user.email}, Created: ${user.created_at}`,
          );
        });
      }

      // 4つ目以降のユーザーを削除
      if (allUsers.length > 3) {
        const usersToDelete = allUsers.slice(3);
        console.log(`削除対象ユーザー数: ${usersToDelete.length}`);
        usersToDelete.forEach((user, index) => {
          console.log(
            `  ${index + 1}. ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Confirmed: ${user.email_confirmed_at}`,
          );
        });

        // 各ユーザーを順次削除
        for (const user of usersToDelete) {
          console.log(`ユーザー削除中: ID ${user.id} (${user.email})`);

          // 削除前の確認
          console.log(`削除前のユーザー詳細:`, {
            id: user.id,
            email: user.email,
            role: user.role,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          });

          try {
            // まずユーザーの詳細を取得して確認
            const { data: userDetails, error: userError } =
              await supabase.auth.admin.getUserById(user.id);
            if (userError) {
              console.error(
                `ユーザー詳細取得エラー (ID: ${user.id}):`,
                userError,
              );
            } else {
              console.log(`削除対象ユーザー詳細:`, userDetails);
            }

            // ユーザー削除を実行
            const { error: deleteError } = await supabase.auth.admin.deleteUser(
              user.id,
            );

            if (deleteError) {
              console.error(
                `ユーザー削除エラー (ID: ${user.id}):`,
                deleteError,
              );
              console.error('エラー詳細:', {
                message: deleteError.message,
                status: deleteError.status,
                details: deleteError,
              });
            } else {
              console.log(`ユーザー削除成功: ID ${user.id} (${user.email})`);
              deletedUsers++;

              // 削除後の確認
              const { data: deletedUserCheck, error: checkError } =
                await supabase.auth.admin.getUserById(user.id);
              if (checkError && checkError.message.includes('User not found')) {
                console.log(`削除確認成功: ユーザー ${user.id} は存在しません`);
              } else if (deletedUserCheck) {
                console.log(
                  `削除確認失敗: ユーザー ${user.id} はまだ存在します`,
                );
              }
            }
          } catch (deleteException) {
            console.error(
              `ユーザー削除例外 (ID: ${user.id}):`,
              deleteException,
            );
            console.error('例外詳細:', {
              name: deleteException.name,
              message: deleteException.message,
              stack: deleteException.stack,
            });
          }
        }
      } else {
        console.log('削除対象のユーザーはありません（3件以下）');
      }
    } catch (authError) {
      console.error('認証ユーザー処理全体エラー:', authError);
    }

    // -------------------------------
    // 2. Jobテーブル 35個目以降削除
    // -------------------------------
    console.log('Jobテーブルのレコード一覧を取得中');
    const { data: jobs, error: jobError } = await supabase
      .from('Job')
      .select('id')
      .order('id', { ascending: true });

    if (jobError) {
      console.error('Job一覧取得エラー:', jobError);
      throw jobError;
    }

    console.log(`取得したJob数: ${jobs ? jobs.length : 0}`);
    if (jobs && jobs.length > 0) {
      console.log(
        'Job ID一覧:',
        jobs.map((j) => j.id),
      );
    }

    const jobsToDelete = jobs ? jobs.slice(35) : []; // 36個目以降
    console.log(`削除対象Job数: ${jobsToDelete.length}`);

    if (jobsToDelete.length > 0) {
      console.log(
        '削除対象Job ID:',
        jobsToDelete.map((j) => j.id),
      );

      for (const job of jobsToDelete) {
        console.log(`Job削除中: ID ${job.id}`);
        const { error } = await supabase.from('Job').delete().eq('id', job.id);
        if (error) {
          console.error(`Job削除エラー (ID: ${job.id}):`, error);
        } else {
          console.log(`Job削除成功: ID ${job.id}`);
          deletedJobs++;
        }
      }
    } else {
      console.log('削除対象のJobはありません（36件以下）');
    }

    // -------------------------------
    // 3. Supabase Storage 35個目以降削除
    // -------------------------------
    const BUCKET_NAME = 'BaitoAI-images';
    console.log(`Storageバケット「${BUCKET_NAME}」のファイル一覧を取得中`);

    const { data: files, error: fileError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (fileError) {
      console.error('Storageファイル一覧取得エラー:', fileError);
    } else {
      console.log(`取得したファイル数: ${files.length}`);

      // 作成日時でファイルをソート（古い順）
      files.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      if (files.length > 35) {
        const filesToDelete = files.slice(35);
        console.log(`削除対象ファイル数: ${filesToDelete.length}`);

        const filePathsToDelete = filesToDelete.map((f) => f.name);

        if (filePathsToDelete.length > 0) {
          console.log('削除対象ファイルパス:', filePathsToDelete);
          const { data: deleteData, error: deleteError } =
            await supabase.storage.from(BUCKET_NAME).remove(filePathsToDelete);

          if (deleteError) {
            console.error('Storageファイル削除エラー:', deleteError);
          } else {
            console.log('Storageファイル削除成功:', deleteData);
            deletedFiles = deleteData.length;
          }
        }
      } else {
        console.log('削除対象のファイルはありません（35件以下）');
      }
    }

    console.log(`=== クリーンアップ処理完了 ===`);
    console.log(`削除されたユーザー: ${deletedUsers}件`);
    console.log(`削除されたJob: ${deletedJobs}件`);
    console.log(`削除されたファイル: ${deletedFiles}件`); 

    // 削除後の確認処理
    try {
      console.log('削除後のユーザー数を確認中...');
      const { data: remainingUsersData, error: remainingError } = 
        await supabase.auth.admin.listUsers();

      if (remainingError) {
        console.error('削除後のユーザー数確認エラー:', remainingError);
      } else {
        remainingUsers = remainingUsersData; 
        console.log(
          `削除後の残存ユーザー数: ${remainingUsers ? remainingUsers.length : 0}`,
        );
        if (remainingUsers && remainingUsers.length > 0) {
          console.log('残存ユーザー:');
          remainingUsers.forEach((user, index) => {
            console.log(`  ${index + 1}. ID: ${user.id}, Email: ${user.email}`);
          });
        }
      }
    } catch (verificationError) {
      console.error('削除後の確認処理エラー:', verificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      deletedUsers,
      deletedJobs,
      deletedFiles,
      remainingUsers: remainingUsers ? remainingUsers.length : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cleanup API エラー:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
