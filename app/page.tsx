import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Utensils, Calendar, MapPin, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-foreground text-background py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <Image 
            src="/eet-logo.jpg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <span className="font-serif text-sm sm:text-xl tracking-wider uppercase">Epicurean Escape <span className="text-primary italic">by Tiara</span></span>
        </div>
        <div className="hidden md:flex gap-8 font-sans text-sm uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/reserve" className="hover:text-primary transition-colors">Reservations</Link>
        </div>
        <Link href="/reserve">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-serif">
            Book a Table
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-40">
           {/* Placeholder for a high-end restaurant image */}
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif text-background mb-6 leading-tight">
            An Exclusive <span className="text-primary italic">Culinary</span> Journey
          </h1>
          <p className="text-xl md:text-2xl font-sans text-background/90 mb-10 max-w-2xl mx-auto">
            Experience the art of fine dining at <span className="italic font-serif">Epicurean Escape by Tiara</span>. Entry is granted exclusively to those with a confirmed reservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reserve">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg font-serif">
                Make a Reservation
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="text-black/60 border-white/30 hover:bg-background hover:text-foreground hover:border-background px-8 py-6 text-lg font-serif transition-all">
                View the Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section id="about" className="py-24 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-foreground">The Philosophy</h2>
            <div className="w-20 h-1 bg-primary"></div>
            <p className="text-lg leading-relaxed text-foreground/80 font-sans">
              At Epicurean Escape, we believe that dining is not just about the food, but the atmosphere, the intimacy, and the anticipation. By operating on a reservation-only basis, we ensure that every guest receives our undivided attention and a perfectly curated experience.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="flex gap-3">
                <Utensils className="text-border" />
                <div>
                  <h4 className="font-serif font-bold">Chef&apos;s Table</h4>
                  <p className="text-sm">Curated seasonal menus</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-border" />
                <div>
                  <h4 className="font-serif font-bold">Exclusive</h4>
                  <p className="text-sm">Limited daily seating</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl border-4 border-border">
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-widest text-primary uppercase">Epicurean Escape by Tiara</h3>
            <p className="text-sm opacity-70">A sanctuary for the senses. Where flavor meets finesse in an atmosphere of unparalleled elegance.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Contact & Location</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p className="flex items-center gap-2"><MapPin size={16} /> 123 Gastronomy Lane, Fine City</p>
              <p className="flex items-center gap-2"><Clock size={16} /> Tue - Sun: 5:00 PM - 11:00 PM</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Stay Informed</h4>
            <p className="text-sm opacity-70">Sign up for our seasonal menu updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/10 border border-white/20 px-4 py-2 rounded flex-1 outline-none focus:border-primary" />
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">Join</Button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs opacity-50 uppercase tracking-widest">
          &copy; 2026 Epicurean Escape. All rights reserved.
        </div>
      </footer>
    </div>
  );
}