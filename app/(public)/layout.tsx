import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </>
  )
}
