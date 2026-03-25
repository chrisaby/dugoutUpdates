import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/features/admin-navbar'

export const metadata = { title: 'FPL Admin' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
