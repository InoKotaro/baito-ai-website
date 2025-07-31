import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b-4 border-orange-400 bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/image/BaitoAI-logo.png"
            alt="Baito AI ロゴ"
            width={150}
            height={40}
            priority
          />
        </Link>

        <nav>
          <ul className="flex items-center gap-6 text-md font-bold">
            <li>
              <Link href="/" className="text-gray-600 hover:text-orange-500">
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className="text-gray-600 hover:text-orange-500"
              >
                お知らせ
              </Link>
            </li>
            <li>
              <Link
                href="/applications"
                className="text-gray-600 hover:text-orange-500"
              >
                応募一覧
              </Link>
            </li>
            <li>
              <button type="button" className="text-gray-600 hover:text-orange-500">
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
