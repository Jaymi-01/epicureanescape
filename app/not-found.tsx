import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Image 
            src="/eet-logo.jpg" 
            alt="Epicurean Escape Logo" 
            width={100} 
            height={100} 
            className="rounded-full border-2 border-primary"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-primary italic">404</h1>
          <h2 className="text-3xl font-serif text-background uppercase tracking-widest">Lost in the Moment</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
          <p className="text-background/60 font-sans text-lg">
            The page you are looking for has eluded us, much like a fleeting flavor profile. 
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-serif px-8 py-6 h-auto text-lg">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Return to the Journey
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-background/30 text-xs uppercase tracking-widest">
        Epicurean Escape by Tiara
      </footer>
    </div>
  );
}
