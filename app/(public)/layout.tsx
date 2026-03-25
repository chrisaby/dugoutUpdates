import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
