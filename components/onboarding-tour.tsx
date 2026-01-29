"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function OnboardingTour() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("adminTourSeen")
    if (!seen) {
      // Delay slightly for effect
      const timer = setTimeout(() => setOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("adminTourSeen", "true")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-serif">Welcome to Your Command Center</DialogTitle>
          <DialogDescription className="text-center pt-2">
            You now have full control over your restaurant operations.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-muted-foreground text-center">
          <p>
            Manage <strong>Reservations</strong>, update your <strong>Menu</strong> instantly, and track <strong>VIP Guests</strong> all from this dashboard.
          </p>
          <p>
            If you ever get lost or need a refresher on how a feature works, check the <strong>Help Guide</strong> in the sidebar.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleClose} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Let's Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
