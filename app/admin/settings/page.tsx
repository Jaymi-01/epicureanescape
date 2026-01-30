"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { X, CalendarOff, Save, Loader2, Download, AlertTriangle } from "lucide-react"
import JSZip from "jszip"
import { toast } from "sonner"

export default function SettingsPage() {
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isBlocking, setIsBlocking] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  // Alert State
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isSavingAlert, setIsSavingAlert] = useState(false)

  // Fetch current settings
  useEffect(() => {
    const unsubDates = onSnapshot(doc(db, "settings", "reservations"), (doc) => {
      if (doc.exists()) {
        setBlockedDates(doc.data().blockedDates || [])
      }
    })

    const unsubAlert = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setIsAlertVisible(data.isAlertVisible || false)
        setAlertMessage(data.alertMessage || "")
      }
    })

    return () => {
      unsubDates()
      unsubAlert()
    }
  }, [])

  const handleBlockDate = async () => {
    if (!selectedDate) return
    const dateStr = selectedDate.toISOString()
    if (blockedDates.includes(dateStr)) return

    setIsBlocking(true)
    try {
      const docRef = doc(db, "settings", "reservations")
      // Create if doesn't exist, else update
      await setDoc(docRef, { 
        blockedDates: arrayUnion(dateStr) 
      }, { merge: true })
    } catch (e) {
      console.error(e)
    } finally {
      setIsBlocking(false)
    }
  }

  const handleUnblockDate = async (dateStr: string) => {
    try {
      const docRef = doc(db, "settings", "reservations")
      await updateDoc(docRef, {
        blockedDates: arrayRemove(dateStr)
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveAlert = async () => {
    setIsSavingAlert(true)
    try {
      await setDoc(doc(db, "settings", "global"), {
        isAlertVisible,
        alertMessage
      }, { merge: true })
      toast.success("Global alert updated")
    } catch (e) {
      console.error(e)
      toast.error("Failed to update alert")
    } finally {
      setIsSavingAlert(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const collections = ["reservations", "menu", "guests", "subscribers", "waitlist"]
      const zip = new JSZip()

      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName))
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        
        if (docs.length > 0) {
          // 1. Collect all unique keys from all documents to ensure we catch every field
          const allKeys = new Set<string>()
          docs.forEach(doc => Object.keys(doc).forEach(k => allKeys.add(k)))
          const headers = Array.from(allKeys).sort() // Sort for consistency

          // 2. Generate CSV header row
          const headerRow = headers.map(h => `"${h}"`).join(",")

          // 3. Generate rows strictly following the header order
          const rows = docs.map(doc => 
            headers.map(key => {
              // Access property safely, default to empty string
              // @ts-ignore
              const val = doc[key]
              const stringVal = String(val === null || val === undefined ? '' : val)
              // Escape double quotes inside values
              return `"${stringVal.replace(/"/g, '""')}"`
            }).join(",")
          ).join("\n")
          
          zip.file(`${colName}.csv`, `\uFEFF${headerRow}\n${rows}`)
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
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-foreground">Restaurant Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your availability and restaurant rules.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Global Alert */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-primary h-5 w-5" />
              <CardTitle>Site Alerts & Service Status</CardTitle>
            </div>
            <CardDescription>Display a prominent banner across the entire website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Global Banner</Label>
                <p className="text-sm text-muted-foreground">Show the message below at the top of every page.</p>
              </div>
              <Switch 
                checked={isAlertVisible}
                onCheckedChange={setIsAlertVisible}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alert Message</Label>
              <div className="flex gap-2">
                <Input 
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="e.g. We are closed today for a private event."
                  className="bg-white"
                />
                <Button onClick={handleSaveAlert} disabled={isSavingAlert} className="bg-primary hover:bg-primary/90">
                  {isSavingAlert ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              disabled={!selectedDate || isBlocking}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isBlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
            <Button onClick={handleExportData} disabled={isExporting} variant="outline" className="gap-2">
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export All Data (CSV ZIP)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}