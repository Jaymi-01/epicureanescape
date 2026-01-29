"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BarChart3,
  Utensils,
    Settings,
    LogOut, 
    ArrowUpRight,
    Clock,
    HelpCircle
  } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
export function AdminSidebar({ mobile = false, onNavigate }: { mobile?: boolean, onNavigate?: () => void }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // The onAuthStateChanged listener in layout will handle the redirect
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-foreground text-background border-r border-border/10">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-serif tracking-wider">TIARA ADMIN</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <LayoutDashboard size={20} />
            Overview
          </Button>
        </Link>
        <Link href="/admin/menu" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin/menu" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <Utensils size={20} />
            Menu
          </Button>
        </Link>
        <Link href="/admin/analytics" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin/analytics" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <BarChart3 size={20} />
            Analytics
          </Button>
        </Link>
        <Link href="/admin/settings" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin/settings" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <Settings size={20} />
            Settings
          </Button>
        </Link>
        <Link href="/admin/waitlist" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin/waitlist" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <Clock size={20} />
            Waitlist
          </Button>
        </Link>
        <Link href="/admin/help" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${pathname === "/admin/help" ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            <HelpCircle size={20} />
            Help Guide
          </Button>
        </Link>        <div className="pt-4 mt-4 border-t border-white/10">
          <Link href="/" target="_blank">
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/10">
              <ArrowUpRight size={20} />
              View Live Site
            </Button>
          </Link>
        </div>
      </nav>
      <div className="p-4 border-t border-white/10">
        <Button 
          variant="destructive" 
          className="w-full gap-2 bg-red-900/50 hover:bg-red-900"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </div>
  )
}
