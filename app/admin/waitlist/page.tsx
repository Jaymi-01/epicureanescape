"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"

interface WaitlistEntry {
  id: string
  name: string
  email: string
  phone: string
  date: string
  createdAt: string
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])

  useEffect(() => {
    const q = query(collection(db, "waitlist"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry))
      setEntries(data)
    })
    return () => unsub()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Remove from waitlist?")) {
      await deleteDoc(doc(db, "waitlist", id))
      toast.success("Removed from waitlist")
    }
  }

  const formatPhoneForWhatsapp = (phone: string) => {
    let clean = phone.replace(/\D/g, '')
    // Assume Nigerian numbers if they start with 0 and are 11 digits
    if (clean.length === 11 && clean.startsWith('0')) {
      clean = '234' + clean.substring(1)
    }
    return clean
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-foreground">Priority Waitlist</h1>
        <p className="text-sm text-muted-foreground">Manage guests waiting for a table opening.</p>
      </header>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  Waitlist is empty.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium font-serif text-base">{entry.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{entry.email}</span>
                      <span className="text-muted-foreground">{entry.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                      onClick={() => {
                        const cleanPhone = formatPhoneForWhatsapp(entry.phone)
                        const msg = encodeURIComponent(`Hello ${entry.name}, good news from Epicurean Escape! A table has opened up for ${new Date(entry.date).toLocaleDateString()}. Are you still interested?`)
                        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Notify
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {entries.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Waitlist is empty.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-medium text-lg">{entry.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>{entry.email}</p>
                <p>{entry.phone}</p>
              </div>
              
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => {
                    const cleanPhone = formatPhoneForWhatsapp(entry.phone)
                    const msg = encodeURIComponent(`Hello ${entry.name}, good news from Epicurean Escape! A table has opened up for ${new Date(entry.date).toLocaleDateString()}. Are you still interested?`)
                    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Notify
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(entry.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
