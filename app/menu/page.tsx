import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";

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
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold font-serif">Charred Suya-Spiced Wagyu</h3>
                <span className="text-lg font-serif italic text-primary">32</span>
              </div>
              <p className="text-muted-foreground text-sm font-sans">Thinly sliced Wagyu beef, traditional Yaji spice, red onion petals, micro-greens.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold font-serif">Deconstructed Moin Moin</h3>
                <span className="text-lg font-serif italic text-primary">26</span>
              </div>
              <p className="text-muted-foreground text-sm font-sans">Honey bean purée, steamed king prawn, quail egg, smoked bell pepper reduction.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold font-serif">Crispy Snail Tempura</h3>
                <span className="text-lg font-serif italic text-primary">34</span>
              </div>
              <p className="text-muted-foreground text-sm font-sans">Jumbo forest snails, light batter, spicy scotch bonnet jam, citrus zest.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold font-serif">Mini Pepper Soup Consommé</h3>
                <span className="text-lg font-serif italic text-primary">22</span>
              </div>
              <p className="text-muted-foreground text-sm font-sans">Clarified aromatic broth, scent leaf infusion, poached croaker fish medallions.</p>
            </div>
          </div>
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
                  Our seasonal menu is prepared exclusively for our guests. Secure your table to view today&apos;s selections.
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
             <div className="grid md:grid-cols-2 gap-10 mb-16">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Pan-Seared Duck Breast</h3>
                    <span className="text-lg font-serif italic text-primary">45</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Cherry gastrique, parsnip purée, roasted root vegetables.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Wagyu Beef Tenderloin</h3>
                    <span className="text-lg font-serif italic text-primary">85</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Potato pavé, bordelaise sauce, bone marrow butter.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Miso Glazed Black Cod</h3>
                    <span className="text-lg font-serif italic text-primary">52</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Bok choy, ginger dashi, lotus root chips.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Wild Mushroom Risotto</h3>
                    <span className="text-lg font-serif italic text-primary">38</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Arborio rice, parmesan crisp, truffle shavings.</p>
                </div>
             </div>

             <h2 className="text-3xl font-serif text-primary mb-8 text-center border-b border-border pb-4">Desserts</h2>
             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Dark Chocolate Soufflé</h3>
                    <span className="text-lg font-serif italic text-primary">18</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Crème anglaise, fresh berries.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold font-serif">Lemon Basil Tart</h3>
                    <span className="text-lg font-serif italic text-primary">16</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">Meringue kisses, basil gel, candied zest.</p>
                </div>
             </div>
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