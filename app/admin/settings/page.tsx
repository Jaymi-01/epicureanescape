"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { X, CalendarOff, Save, Loader2, Download } from "lucide-react"
import JSZip from "jszip"

export default function SettingsPage() {
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [saving, setSaving] = useState(false)

  // Fetch current settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "reservations"), (doc) => {
      if (doc.exists()) {
        setBlockedDates(doc.data().blockedDates || [])
      }
    })
    return () => unsub()
  }, [])

  const handleBlockDate = async () => {
    if (!selectedDate) return
    const dateStr = selectedDate.toISOString()
    if (blockedDates.includes(dateStr)) return

    setSaving(true)
    try {
      const docRef = doc(db, "settings", "reservations")
      // Create if doesn't exist, else update
      await setDoc(docRef, { 
        blockedDates: arrayUnion(dateStr) 
      }, { merge: true })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleUnblockDate = async (dateStr: string) => {
    setSaving(true)
    try {
      const docRef = doc(db, "settings", "reservations")
      await updateDoc(docRef, {
        blockedDates: arrayRemove(dateStr)
      })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    setSaving(true)
    try {
      const collections = ["reservations", "menu", "guests", "subscribers", "waitlist"]
      const zip = new JSZip()

      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName))
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        
        if (docs.length > 0) {
          // Generate CSV header
          const headers = Object.keys(docs[0]).join(",")
          // Generate CSV rows
          const rows = docs.map(doc => 
            Object.values(doc).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
          ).join("\n")
          
          zip.file(`${colName}.csv`, `${headers}\n${rows}`)
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `epicurean-backup-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Backup downloaded successfully")
    } catch (e) {
      console.error("Export failed:", e)
      toast.error("Failed to export data")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-foreground">Restaurant Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your availability and restaurant rules.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Date Blocker */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarOff className="text-primary h-5 w-5" />
              <CardTitle>Block Reservation Dates</CardTitle>
            </div>
            <CardDescription>Select a date to mark it as sold out or closed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center border rounded-md p-4 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
            <Button 
              onClick={handleBlockDate} 
              disabled={!selectedDate || saving}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Block Selected Date
            </Button>
          </CardContent>
        </Card>

        {/* Blocked Dates List */}
        <Card>
          <CardHeader>
            <CardTitle>Currently Blocked Dates</CardTitle>
            <CardDescription>Guests cannot book reservations on these days.</CardDescription>
          </CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground italic">No dates are currently blocked.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {blockedDates.sort().map((dateStr) => (
                  <Badge key={dateStr} variant="secondary" className="pl-3 pr-1 py-1.5 gap-2 text-sm bg-red-50 text-red-700 border-red-100">
                    {format(new Date(dateStr), "PPP")}
                    <button 
                      onClick={() => handleUnblockDate(dateStr)}
                      className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Download a backup of your entire database.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} disabled={saving} variant="outline" className="gap-2">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export All Data (CSV ZIP)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
