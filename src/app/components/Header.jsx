import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b-4 border-orange-400 bg-white px-6 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/image/BaitoAI-logo.png"
          alt="Baito AI ロゴ"
          width={150}
          height={40}
          priority
        />
      </Link>

      {/* <nav>
        ここにナビゲーションリンクなどを追加できます
      </nav> */}
    </header>
  );
}
