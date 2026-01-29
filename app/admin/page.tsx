"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, increment, setDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  CalendarDays, 
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed,
  MessageSquare,
  Mail,
  Crown,
  Star,
  Printer
} from "lucide-react"
import { sendThankYou } from "@/app/actions"
import { toast } from "sonner"

interface Reservation {
  id: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  guests: string
  requests: string
  status?: string
  thankYouSent?: boolean
  createdAt: string
}

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

interface Guest {
  email: string
  name: string
  visits: number
  notes?: string
}

const StatusBadge = ({ status }: { status?: string }) => {
  switch (status) {
    case 'Seated':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Seated</Badge>
    case 'Completed':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>
    case 'Cancelled':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Cancelled</Badge>
    default:
      return <Badge className="bg-primary/10 text-primary border-primary/20 shadow-none hover:bg-primary/20">Confirmed</Badge>
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reservations")
  const [viewMode, setViewMode] = useState<"upcoming" | "all">("upcoming")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Audio Ref
  const [lastResCount, setLastResCount] = useState(0)

  const playNotification = () => {
    try {
      const audio = new Audio("https://cdn.freesound.org/previews/234/234524_4019029-lq.mp3") // Gentle bell sound
      audio.volume = 0.5
      audio.play().catch(e => console.log("Audio play failed (user interaction required first)", e))
    } catch (e) {
      console.error(e)
    }
  }

  // Fetch Data Real-time
  useEffect(() => {
    let qReservations = query(collection(db, "reservations"), orderBy("createdAt", "desc"))
    
    if (viewMode === 'upcoming') {
      // Create ISO string for today at 00:00:00 to show today's bookings + future
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      qReservations = query(
        collection(db, "reservations"), 
        where("date", ">=", today.toISOString()),
        orderBy("date", "asc")
      )
    } else {
      // History: Completed or Cancelled
      qReservations = query(
        collection(db, "reservations"), 
        where("status", "in", ["Completed", "Cancelled"]),
        orderBy("createdAt", "desc")
      )
    }

    const unsubscribeRes = onSnapshot(qReservations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
      setReservations(data)
      
      // Play sound if count increased (new booking)
      if (lastResCount > 0 && data.length > lastResCount) {
        playNotification()
        toast.success("New Reservation Received!")
      }
      setLastResCount(data.length)
    })

    const qSubscribers = query(collection(db, "subscribers"), orderBy("createdAt", "desc"))
    const unsubscribeSub = onSnapshot(qSubscribers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscriber))
      setSubscribers(data)
    })

    const qGuests = query(collection(db, "guests"))
    const unsubscribeGuests = onSnapshot(qGuests, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Guest)
      setGuests(data)
    })

    return () => {
      unsubscribeRes()
      unsubscribeSub()
      unsubscribeGuests()
    }
  }, [viewMode])

  const handleStatusChange = async (id: string, newStatus: string, guestEmail: string) => {
    try {
      const resRef = doc(db, "reservations", id)
      await updateDoc(resRef, {
        status: newStatus
      })

      // CRM: Increment visits if completed
      if (newStatus === 'Completed') {
        const guestRef = doc(db, "guests", guestEmail)
        const guestSnap = await getDoc(guestRef)
        
        if (guestSnap.exists()) {
          await updateDoc(guestRef, {
            visits: increment(1),
            lastVisit: new Date().toISOString()
          })
        } else {
          // Create guest profile if missing (backfill)
          // We need to fetch the reservation to get the name, but we can pass it or just use email for now
          // Ideally we pass the name to handleStatusChange too
          await setDoc(guestRef, {
            email: guestEmail,
            name: "Guest", // Fallback name, or we update handleStatusChange to accept name
            visits: 1,
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString()
          })
        }
      }

      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleSendThankYou = async (id: string, email: string, name: string) => {
    if (confirm(`Send thank you email to ${name}?`)) {
      const result = await sendThankYou(id, email, name)
      if (!result.success) alert("Failed to send email")
    }
  }

  const formatPhoneForWhatsapp = (phone?: string) => {
    if (!phone) return ''
    let clean = phone.replace(/\D/g, '')
    if (clean.length === 11 && clean.startsWith('0')) {
      clean = '234' + clean.substring(1)
    }
    return clean
  }

  const handlePrintBriefing = () => {
    const today = new Date().toLocaleDateString()
    const todaysBookings = reservations.filter(r => new Date(r.date).toLocaleDateString() === today).sort((a, b) => a.time.localeCompare(b.time))

    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Briefing - ${today}</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .notes { font-style: italic; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Epicurean Escape - Service Briefing</h1>
          <p><strong>Date:</strong> ${today}</p>
          <p><strong>Total Guests:</strong> ${todaysBookings.reduce((acc, curr) => acc + parseInt(curr.guests), 0)}</p>
          
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Guest Name</th>
                <th>Pax</th>
                <th>Contact</th>
                <th>Notes / Requests</th>
              </tr>
            </thead>
            <tbody>
              ${todaysBookings.map(r => `
                <tr>
                  <td>${r.time}</td>
                  <td>${r.name}</td>
                  <td>${r.guests}</td>
                  <td>${r.phone || '-'}</td>
                  <td class="notes">${r.requests || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Filter Data
  const filteredReservations = reservations.filter(res => 
    res.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Manager.</p>
        </div>

        <div className="w-full md:w-auto">
            <div className="bg-white p-2 px-4 rounded-full border border-gray-200 flex items-center gap-2 text-sm text-gray-500 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full md:w-auto">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent outline-none w-full md:min-w-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-3xl font-bold font-serif">{reservations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total database records</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary shadow-sm">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Newsletter Fans</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-3xl font-bold font-serif">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active subscribers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Today's Guests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-3xl font-bold font-serif">
              {reservations.filter(r => {
                if (!r.date) return false;
                const rDate = new Date(r.date);
                const today = new Date();
                return rDate.getDate() === today.getDate() && 
                        rDate.getMonth() === today.getMonth() &&
                        rDate.getFullYear() === today.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expected arrival</p>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className={`justify-start gap-2 ${activeTab === "reservations" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("reservations")}
            >
              <CalendarDays size={18} />
              Reservations
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start gap-2 ${activeTab === "subscribers" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("subscribers")}
            >
              <Users size={18} />
              Subscribers
            </Button>
          </div>
          
          {activeTab === "reservations" && (
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "upcoming" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("upcoming")}
                className="text-xs"
              >
                Upcoming
              </Button>
              <Button 
                variant={viewMode === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("all")}
                className="text-xs"
              >
                History
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrintBriefing}
                className="text-xs gap-2 ml-2 border-dashed"
              >
                <Printer size={12} />
                Print Briefing
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-0 overflow-x-auto">
          {activeTab === 'reservations' ? (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Reservation Date</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {searchTerm ? "No matching reservations found." : "No bookings found yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                    filteredReservations.map((res) => {
                      const guestProfile = guests.find(g => g.email === res.email)
                      const isVIP = (guestProfile?.visits || 0) > 3

                      return (
                        <TableRow key={res.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell>
                            <StatusBadge status={res.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium font-serif text-base flex items-center gap-2">
                                {res.name}
                                {isVIP && <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />}
                              </span>
                              {guestProfile && guestProfile.visits > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                  <Star className="h-2 w-2" />
                                  {guestProfile.visits} Visits
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{res.date ? new Date(res.date).toLocaleDateString() : "N/A"}</span>
                              <span className="text-xs text-muted-foreground">{res.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>{res.guests} Guests</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span>{res.email}</span>
                              <span className="text-muted-foreground">{res.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm italic text-muted-foreground">
                            {res.requests || "None"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {res.phone && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    if (!res.phone) return
                                    const cleanPhone = formatPhoneForWhatsapp(res.phone)
                                    const msg = encodeURIComponent(`Hello ${res.name}, this is Epicurean Escape. We look forward to welcoming you on ${new Date(res.date).toLocaleDateString()} at ${res.time}. Please confirm your reservation.`)
                                    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Confirmed', res.email)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Seated', res.email)}>
                                    <UtensilsCrossed className="mr-2 h-4 w-4 text-blue-600" /> Seated
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Completed', res.email)}>
                                    <Clock className="mr-2 h-4 w-4 text-green-600" /> Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Cancelled', res.email)}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" /> Cancelled
                                  </DropdownMenuItem>
                                  {res.status === 'Completed' && !res.thankYouSent && (
                                    <DropdownMenuItem onClick={() => handleSendThankYou(res.id, res.email, res.name)}>
                                      <Mail className="mr-2 h-4 w-4 text-purple-600" /> Send Thank You
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Joined On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      {searchTerm ? "No matching subscribers found." : "No subscribers found yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Subscribed</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  )
}