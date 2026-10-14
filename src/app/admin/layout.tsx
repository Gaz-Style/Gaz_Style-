import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminHeader from '@/components/AdminHeader';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication bypassed for development
  const user = { id: 'dev-user', role: 'admin' };

  return (
    <AdminLayoutClient>
      {/* Admin Topbar */}
      <AdminHeader hasUser={!!user} />
      
      <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden bg-[#0f1115]">
        {children}
      </div>
    </AdminLayoutClient>
  );
}

