"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
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
  MessageSquare
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

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
  createdAt: string
}

interface Subscriber {
  id: string
  email: string
  createdAt: string
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
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch Data Real-time
  useEffect(() => {
    const qReservations = query(collection(db, "reservations"), orderBy("createdAt", "desc"))
    const unsubscribeRes = onSnapshot(qReservations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
      setReservations(data)
    })

    const qSubscribers = query(collection(db, "subscribers"), orderBy("createdAt", "desc"))
    const unsubscribeSub = onSnapshot(qSubscribers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscriber))
      setSubscribers(data)
    })

    return () => {
      unsubscribeRes()
      unsubscribeSub()
    }
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const resRef = doc(db, "reservations", id)
      await updateDoc(resRef, {
        status: newStatus
      })
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
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
          <Badge variant="outline" className="uppercase tracking-widest text-xs py-1 self-start md:self-center">Live Data</Badge>
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
                  filteredReservations.map((res) => (
                    <TableRow key={res.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <StatusBadge status={res.status} />
                      </TableCell>
                      <TableCell className="font-medium font-serif text-base">{res.name}</TableCell>
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
                                const msg = encodeURIComponent(`Hello ${res.name}, this is Epicurean Escape. We look forward to welcoming you on ${new Date(res.date).toLocaleDateString()} at ${res.time}. Please confirm your reservation.`)
                                window.open(`https://wa.me/${res.phone.replace(/\D/g, '')}?text=${msg}`, '_blank')
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
                              <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Confirmed')}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Seated')}>
                                <UtensilsCrossed className="mr-2 h-4 w-4 text-blue-600" /> Seated
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Completed')}>
                                <Clock className="mr-2 h-4 w-4 text-green-600" /> Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(res.id, 'Cancelled')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" /> Cancelled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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