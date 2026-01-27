"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  CalendarDays, 
  LogOut, 
  Search,
  ArrowUpRight,
  Menu,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Reservation {
  id: string
  name: string
  email: string
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

// Shared Navigation Content
const NavContent = ({ activeTab, setActiveTab, handleLogout }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void, 
  handleLogout: () => void 
}) => (
  <>
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
  </>
)

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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reservations")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
      setReservations(data)
    })

    // Listen to Subscribers
    const qSubscribers = query(collection(db, "subscribers"), orderBy("createdAt", "desc"))
    const unsubscribeSub = onSnapshot(qSubscribers, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscriber))
      setSubscribers(data)
    })

    return () => {
      unsubscribeRes()
      unsubscribeSub()
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    window.location.href = "/login"
  }

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

  const getStatusBadge = (status: string) => {
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

  // Filter Data
  const filteredReservations = reservations.filter(res => 
    res.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Process data for chart
  const processChartData = () => {
    if (reservations.length === 0) {
      // Return placeholder data if empty so chart is visible during dev
      return [
        { name: "Mon", total: 0 },
        { name: "Tue", total: 0 },
        { name: "Wed", total: 0 },
        { name: "Thu", total: 0 },
        { name: "Fri", total: 0 },
        { name: "Sat", total: 0 },
        { name: "Sun", total: 0 },
      ]
    }

    const dayMap = new Map<string, number>()
    reservations.forEach(curr => {
      if (!curr.date) return
      // Use short weekday name
      const date = new Date(curr.date).toLocaleDateString('en-US', { weekday: 'short' })
      dayMap.set(date, (dayMap.get(date) || 0) + 1)
    })

    // Convert map to array and ensure basic sorting order if possible, or just return entries
    // For a simple view, we just return the days that have data
    const data = Array.from(dayMap, ([name, total]) => ({ name, total }))
    return data.length > 0 ? data : [{ name: "No Data", total: 0 }]
  }

  const chartData = processChartData()

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-foreground text-background hidden md:flex flex-col border-r border-border/10 fixed h-full z-10">
        <NavContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-foreground text-background border-r border-border/10">
                <NavContent 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  handleLogout={handleLogout} 
                />
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-foreground">Overview</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Manager.</p>
            </div>
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
              <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
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
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Todays Guests</CardTitle>
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
            <div>
              <h3 className="font-serif text-lg md:text-xl">{activeTab === 'reservations' ? 'Recent Reservations' : 'Subscriber List'}</h3>
              <p className="text-sm text-muted-foreground">Manage your {activeTab === 'reservations' ? 'table bookings' : 'email audience'}.</p>
            </div>
            <Badge variant="outline" className="uppercase tracking-widest text-xs py-1 self-start md:self-center">Live Data</Badge>
          </div>
          
          <div className="p-0 overflow-x-auto">
            {activeTab === 'reservations' ? (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-30">Status</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Reservation Date</TableHead>
                    <TableHead>Party Size</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead className="w-12.5"></TableHead>
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
                        <TableCell className="text-muted-foreground">{res.email}</TableCell>
                        <TableCell className="max-w-50 truncate text-sm italic text-muted-foreground">
                          {res.requests || "None"}
                        </TableCell>
                        <TableCell>
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

        {/* Analytics Graph */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-serif text-lg mb-4">Weekly Booking Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#741213" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
