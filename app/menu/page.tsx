import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MenuContent } from "@/components/menu-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seasonal Menu",
  description: "Explore our curated selection of Nigerian fusion appetizers, main courses, and desserts. View pricing and exclusive offerings.",
}

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-foreground text-background py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <Image 
            src="/eet-logo.jpg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <span className="font-serif text-sm sm:text-xl tracking-wider uppercase">Epicurean Escape <span className="text-primary italic">by Tiara</span></span>
        </Link>
        <div className="hidden md:flex gap-8 font-sans text-sm uppercase tracking-widest">
          <Link href="/#about" className="hover:text-primary transition-colors">Philosophy</Link>
          <Link href="/menu" className="text-primary transition-colors">Menu</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <Link href="/reserve">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-serif">
            Book a Table
          </Button>
        </Link>
      </nav>

      <MenuContent />
      
      <footer id="contact" className="bg-foreground text-background py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-xs opacity-50 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Epicurean Escape by Tiara. All rights reserved.
        </div>
      </footer>
    </div>
  );
}