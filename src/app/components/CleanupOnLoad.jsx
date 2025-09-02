'use client';

import { useEffect } from 'react';

export default function CleanupOnLoad() {
  useEffect(() => {
    const performCleanup = async () => {
      try {
        console.log('クリーンアップ処理を開始...');

        const response = await fetch('/api/cleanup');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          console.log('クリーンアップ完了:', result);
          console.log(`削除されたユーザー: ${result.deletedUsers}件`);
          console.log(`削除されたJob: ${result.deletedJobs}件`);
        } else {
          console.error('クリーンアップ失敗:', result.error);
        }
      } catch (error) {
        console.error('クリーンアップAPI呼び出しエラー:', error);
        console.error('エラー詳細:', error.message);
      }
    };

    // ページロード時にクリーンアップ実行
    performCleanup();
  }, []);

  // このコンポーネントは何も表示しない
  return null;
}
