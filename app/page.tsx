import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Utensils, Calendar, MapPin, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
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

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif text-foreground">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground font-sans">Everything you need to know before your visit.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-serif text-lg">How do reservations work?</AccordionTrigger>
              <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
                Reservations are mandatory for entry. We release tables 30 days in advance. To maintain our intimate atmosphere, we require a deposit of $50 per person upon booking, which is applied to your final bill.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-serif text-lg">What type of cuisine do you serve?</AccordionTrigger>
              <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
                Our cuisine is a sophisticated fusion of global techniques with a distinct homage to Nigerian heritage. We focus on elevating traditional flavors through modern culinary artistry, using only the finest seasonal ingredients.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-serif text-lg">Can you accommodate dietary restrictions?</AccordionTrigger>
              <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
                Absolutely. When making your reservation, please detail any allergies or dietary requirements in the "Special Requests" field. Our culinary team is adept at crafting bespoke modifications for vegetarian, gluten-free, and other specific diets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-serif text-lg">Is there a dress code?</AccordionTrigger>
              <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
                We encourage "Smart Elegance." Gentlemen are requested to wear jackets or collared shirts. Athletic wear, shorts, and flip-flops are not permitted in the dining room to preserve the ambiance for all guests.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="font-serif text-lg">Do you offer private dining?</AccordionTrigger>
              <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
                Yes, we have an exclusive private dining room that seats up to 12 guests. For private event inquiries and larger parties, please contact our concierge directly via email.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-foreground text-background py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-widest text-primary uppercase">Epicurean Escape by Tiara</h3>
            <p className="text-sm opacity-70">A sanctuary for the senses. Where flavor meets finesse in an atmosphere of unparalleled elegance.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Contact & Location</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p className="flex items-center gap-2"><MapPin size={16} /> 1A,Arowolo Street,Beside Top Taste Butter Bread,Abule Egba,Lagos.</p>
              <p className="flex items-center gap-2"><Clock size={16} /> Mon - Sun: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-lg">Stay Informed</h4>
            <p className="text-sm opacity-70">Sign up for our seasonal menu updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/10 border border-white/20 px-4 py-2 rounded flex-1 outline-none focus:border-primary text-sm" />
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 h-auto text-sm">Join</Button>
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