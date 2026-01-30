"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AlertTriangle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function GlobalAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [isDismissed, setIsDismissed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check session storage to see if user dismissed it this session
    const dismissed = sessionStorage.getItem("global-alert-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
    }

    const unsub = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setIsVisible(data.isAlertVisible || false)
        setMessage(data.alertMessage || "")
      }
    })
    return () => unsub()
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem("global-alert-dismissed", "true")
  }

  // Don't show on admin pages or login
  if (pathname?.startsWith("/admin") || pathname === "/login") return null

  if (!isVisible || isDismissed || !message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary text-white relative z-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-center gap-3 text-sm font-medium text-center">
          <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" />
          <p className="pt-0.5">{message}</p>
          <button 
            onClick={handleDismiss}
            className="absolute right-2 top-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
