"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Image 
            src="/eet-logo.jpg" 
            alt="Epicurean Escape Logo" 
            width={100} 
            height={100} 
            className="rounded-full border-2 border-primary/50"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-foreground italic">An Unforeseen Distraction</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
          <p className="text-muted-foreground font-sans text-lg">
            We encountered a slight complication while preparing your experience. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button 
            onClick={() => reset()}
            className="bg-primary text-white hover:bg-primary/90 font-serif px-8 py-6 h-auto text-lg"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background font-serif px-8 py-6 h-auto text-lg w-full">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-foreground/30 text-xs uppercase tracking-widest">
        Epicurean Escape by Tiara
      </footer>
    </div>
  )
}
