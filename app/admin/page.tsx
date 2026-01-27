"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
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
  Users, 
  CalendarDays, 
  LogOut, 
  Search,
  ArrowUpRight
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reservations")
  const [reservations, setReservations] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Check Auth on Mount
  useEffect(() => {
    const hasToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
    if (!hasToken) {
      router.push("/login")
      return
    }

    // Listen to Reservations
    const qReservations = query(collection(db, "reservations"), orderBy("createdAt", "desc"))
    const unsubscribeRes = onSnapshot(qReservations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReservations(data)
    })

    // Listen to Subscribers
    const qSubscribers = query(collection(db, "subscribers"), orderBy("createdAt", "desc"))
    const unsubscribeSub = onSnapshot(qSubscribers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSubscribers(data)
      setLoading(false)
    })

    return () => {
      unsubscribeRes()
      unsubscribeSub()
    }
  }, [])

  const handleLogout = () => {
    // strictly clear cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    // Force reload to clear any client-side state/cache and trigger middleware
    window.location.href = "/login"
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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background hidden md:flex flex-col border-r border-border/10 fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif tracking-wider">TIARA ADMIN</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${activeTab === "reservations" ? "bg-white/10 text-white" : "text-white/60"}`}
            onClick={() => setActiveTab("reservations")}
          >
            <CalendarDays size={20} />
            Reservations
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 hover:bg-white/10 hover:text-white ${activeTab === "subscribers" ? "bg-white/10 text-white" : "text-white/60"}`}
            onClick={() => setActiveTab("subscribers")}
          >
            <Users size={20} />
            Subscribers
          </Button>
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link href="/" target="_blank">
              <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/10">
                <ArrowUpRight size={20} />
                View Live Site
              </Button>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button 
            variant="destructive" 
            className="w-full gap-2 bg-red-900/50 hover:bg-red-900"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Overview</h1>
            <p className="text-muted-foreground">Welcome back, Manager.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white p-2 px-4 rounded-full border border-gray-200 flex items-center gap-2 text-sm text-gray-500 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className="bg-transparent outline-none min-w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">{reservations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-secondary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Newsletter Fans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">{subscribers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active subscribers</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-600 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Todays Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl">{activeTab === 'reservations' ? 'Recent Reservations' : 'Subscriber List'}</h3>
              <p className="text-sm text-muted-foreground">Manage your {activeTab === 'reservations' ? 'table bookings' : 'email audience'}.</p>
            </div>
            <Badge variant="outline" className="uppercase tracking-widest text-xs py-1">Live Data</Badge>
          </div>
          
          <div className="p-0">
            {activeTab === 'reservations' ? (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Reservation Date</TableHead>
                    <TableHead>Party Size</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        {searchTerm ? "No matching reservations found." : "No bookings found yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((res) => (
                      <TableRow key={res.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary border-primary/20 shadow-none hover:bg-primary/20">Confirmed</Badge>
                        </TableCell>
                        <TableCell className="font-medium font-serif text-lg">{res.name}</TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                             <span className="font-medium">{res.date ? new Date(res.date).toLocaleDateString() : "N/A"}</span>
                             <span className="text-xs text-muted-foreground">{res.time}</span>
                           </div>
                        </TableCell>
                        <TableCell>{res.guests} Guests</TableCell>
                        <TableCell className="text-muted-foreground">{res.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm italic text-muted-foreground">
                          {res.requests || "None"}
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
      </main>
    </div>
  )
}
