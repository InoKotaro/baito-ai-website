'use client';

import { usePathname } from 'next/navigation';

import AdminHeader from './AdminHeader';
import PublicHeader from './PublicHeader';

export default function Header(props) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <AdminHeader {...props} />;
  }

  return <PublicHeader {...props} />;
}