"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { OnboardingTour } from "@/components/onboarding-tour"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true)
      } else {
        router.replace("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground animate-pulse">Verifying access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="w-64 hidden md:block fixed h-full z-10 border-r border-border/10 bg-foreground text-background">
        <AdminSidebar />
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        <div className="md:hidden bg-foreground text-background p-4 flex items-center justify-between sticky top-0 z-20">
          <span className="font-serif tracking-wider">TIARA ADMIN</span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-foreground text-background border-r border-border/10">
              <AdminSidebar mobile onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
        <OnboardingTour />
      </div>
    </div>
  )
}