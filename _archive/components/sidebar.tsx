'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquaresFour, Image, DownloadSimple, Palette, Gear } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client'; // Use browser client for client component

const navItems = [
  { href: '/dashboard', icon: SquaresFour, label: 'Dashboard' },
  { href: '/inventory', icon: ImageIcon, label: 'Inventory' },
  { href: '/export', icon: DownloadSimple, label: 'Export Data' },
  { href: '/design', icon: Palette, label: 'Site Design' },
  { href: '/settings', icon: Gear, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createBrowserSupabaseClient();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserName(user?.email || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserName(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);


  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar-bg-dashboard text-sidebar-text-dashboard p-8 flex flex-col gap-2 z-10">
      <div className="font-display text-2xl text-white mb-10 tracking-wider">
        Exhibitly.
      </div>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
            pathname === item.href
              ? 'bg-white/[0.1] text-white font-medium'
              : 'hover:bg-white/[0.05] hover:text-white'
          }`}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
      <div className="mt-auto text-xs opacity-50">
        Logged in as
        <br />
        <span className="font-medium text-white">{userName || 'Guest'}</span>
      </div>
    </aside>
  );
}
