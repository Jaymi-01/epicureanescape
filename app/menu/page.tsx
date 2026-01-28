"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: "Appetizer" | "Main" | "Dessert"
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "menu"), orderBy("name", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))
      setMenuItems(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const appetizers = menuItems.filter(i => i.category === "Appetizer")
  const mains = menuItems.filter(i => i.category === "Main")
  const desserts = menuItems.filter(i => i.category === "Dessert")

  const MenuList = ({ items }: { items: MenuItem[] }) => (
    <div className="grid md:grid-cols-2 gap-8">
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold font-serif">{item.name}</h3>
            <span className="text-lg font-serif italic text-primary">₦{item.price}</span>
          </div>
          <p className="text-muted-foreground text-sm font-sans">{item.description}</p>
        </div>
      ))}
    </div>
  )

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

      <main className="flex-grow pb-16">
        <div className="py-16 text-center">
          <h1 className="text-5xl font-serif text-foreground mb-4">Seasonal Selections</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-sans max-w-2xl mx-auto px-4">
            Our menu is a living reflection of the season, crafted with the finest locally sourced ingredients.
          </p>
        </div>

        {/* Teaser Section: Appetizers (Visible) */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-serif text-primary mb-8 text-center border-b border-border pb-4">Nigerian Heritage Appetizers</h2>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading heritage selections...</p>
          ) : appetizers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground italic underline">The chef is currently curating today's appetizers. Please check back soon.</p>
          ) : (
            <MenuList items={appetizers} />
          )}
        </section>

        {/* Blurred Section: Main Courses & Desserts */}
        <section className="relative max-w-4xl mx-auto px-6">
          
          {/* Overlay Card */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-2xl border-2 border-primary bg-background/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Exclusive Menu Access</CardTitle>
                <CardDescription className="font-sans text-base pt-2">
                  Our full seasonal menu is prepared exclusively for our guests. Secure your table to view today's selections.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Link href="/reserve">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-serif px-8">
                    Secure Your Table
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Blurred Content */}
          <div className="filter blur-md select-none pointer-events-none opacity-50">
             <h2 className="text-3xl font-serif text-primary mb-8 text-center border-b border-border pb-4">Main Courses</h2>
             {mains.length === 0 ? (
               <div className="h-40 flex items-center justify-center italic text-muted-foreground">Premium entrées pending selection...</div>
             ) : (
               <div className="mb-16">
                 <MenuList items={mains} />
               </div>
             )}

             <h2 className="text-3xl font-serif text-primary mb-8 text-center border-b border-border pb-4">Desserts</h2>
             {desserts.length === 0 ? (
               <div className="h-40 flex items-center justify-center italic text-muted-foreground">Signature desserts pending selection...</div>
             ) : (
               <MenuList items={desserts} />
             )}
          </div>
        </section>
      </main>
      
      <footer id="contact" className="bg-foreground text-background py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-xs opacity-50 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Epicurean Escape by Tiara. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
