import Link from 'next/link';
import { BarChart3, LayoutDashboard, LogOut, Settings } from 'lucide-react';

// Next.js 16: voorkomt hang met prefetch + loading.tsx
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions/auth';
import { getOrCreateWorkspaceForUser } from '@/app/actions/workspace';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { email?: string } | null = null;
  let workspace: { name: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    workspace = await getOrCreateWorkspaceForUser();
  } catch (err) {
    console.error('Dashboard layout error:', err);
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 space-y-1">
          <Link href="/" className="font-semibold text-lg block">
            B2B Visitor
          </Link>
          {workspace && (
            <p className="text-xs text-muted-foreground truncate">
              {workspace.name}
            </p>
          )}
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Link
            href="/dashboard"
            prefetch={false}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/sites"
            prefetch={false}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            Sites
          </Link>
          <Link
            href="/dashboard/settings"
            prefetch={false}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Settings className="h-5 w-5" />
            Instellingen
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground truncate mb-2">
            {user?.email}
          </div>
          <form action={signOut}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Uitloggen
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
