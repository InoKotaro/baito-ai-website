# バイトAI WEBサイト（ポートフォリオ）

Next.js と Tailwind CSS を使い、求職者向けの求人サイトをイメージして開発しました。
路線・職種・時給で絞り込みができ、応募フォームからそのまま応募も可能です。  
応募履歴も見られる、**シンプルかつ実用的な UI** を意識しました。

## バイトAIについて

当ポートフォリオで使用している職場風景の画像はGoogle DeepMind製画像生成AIツールWhiskで生成しています。
AIが作った世界観という意味をこめて、「バイトAI」という名前にしました。

---

## デモサイト

要記載

---

## 使用技術

- Next.js 14（App Router）

- React

- Tailwind CSS

- PostgreSQL（データベース）

- Prisma（ORM）

- NextAuth.js（認証機能：今後実装予定）

- GitHub

---

## 主な機能

- 求人一覧表示（ログイン不要・絞り込み対応）

- 求人詳細ページ

- 応募フォーム（DB保存）

- 応募履歴ページ（ユーザー単位）

- レスポンシブ対応（スマホ表示にも最適化）

- 企業向け求人投稿機能（実装予定）

---

## ER図

当サイトのデータ構造は以下のER図の通りです。

要記載

---

## セットアップ方法

### 1⃣ このリポジトリをクローン

```bash
git clone https://github.com/InoKotaro/ai-railway-website.git
cd ai-railway-website
```

### 2⃣ 依存パッケージをインストール

```bash
npm install
```

### 3⃣ .env ファイルを作成し、以下の内容を記述

## ユーザー登録があるためPWとか要書換え

```bash
DATABASE_URL=postgresql://your-db-user:password@localhost:5432/your-db-name
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4⃣ Prisma マイグレーションを実行

```bash
npx prisma migrate dev --name init
```

### 5⃣ 開発サーバーを起動

```bash
npm run dev
```

### 6⃣ ブラウザでアクセス

`http://localhost:3000`

## こだわりポイント

- ディレクトリ構造やファイル分割により保守性を向上

- Tailwind CSS を使用

- 応募データは PostgreSQL に保存
