"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { motion, Variants } from "framer-motion"

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: "Appetizer" | "Main" | "Dessert"
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export function MenuContent() {
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
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="grid md:grid-cols-2 gap-8"
    >
      {items.map((item) => (
        <motion.div 
          key={item.id} 
          variants={fadeInUp}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="space-y-2 p-4 rounded-lg hover:bg-secondary/30 transition-colors"
        >
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold font-serif">{item.name}</h3>
            <span className="text-lg font-serif italic text-primary">₦{item.price}</span>
          </div>
          <p className="text-muted-foreground text-sm font-sans">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )

  return (
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
  )
}
