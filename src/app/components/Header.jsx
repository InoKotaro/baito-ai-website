'use client';

import { usePathname } from 'next/navigation';
import { useContext } from 'react'; // NEW: Import useContext

import { AuthContext } from '@/context/AuthContext'; // NEW: Import AuthContext

import AdminHeader from './AdminHeader';
import PublicHeader from './PublicHeader';

export default function Header(props) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  const { user, loading } = useContext(AuthContext); // NEW: Get user and loading from context

  if (isAdminPage) {
    return <AdminHeader {...props} user={user} isLoading={loading} />;
  }

  return <PublicHeader {...props} user={user} isLoading={loading} />;
}
