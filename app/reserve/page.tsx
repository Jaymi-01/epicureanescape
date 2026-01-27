import { ReservationForm } from "@/components/reservation/reservation-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ReservePage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col py-12 px-4">
      <div className="max-w-4xl mx-auto w-full mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-foreground hover:text-primary transition-colors font-sans uppercase tracking-widest text-sm font-medium"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <main className="flex-grow flex items-center justify-center">
        <ReservationForm />
      </main>

      <footer className="mt-12 text-center text-foreground/50 font-sans text-sm">
        <p>&copy; 2026 Epicurean Escape by Tiara. Reservations subject to availability.</p>
      </footer>
    </div>
  );
}