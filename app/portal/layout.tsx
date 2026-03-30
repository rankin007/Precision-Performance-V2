import Sidebar from '@/components/Sidebar'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-sans selection:bg-[#D4AF37]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
