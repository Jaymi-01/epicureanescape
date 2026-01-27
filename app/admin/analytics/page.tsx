"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Reservation {
  id: string
  date: string
  status?: string
}

export default function AnalyticsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const qReservations = query(collection(db, "reservations"), orderBy("createdAt", "desc"))
    const unsubscribeRes = onSnapshot(qReservations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
      setReservations(data)
    })

    return () => unsubscribeRes()
  }, [])

  // Process data for chart
  const processChartData = () => {
    if (reservations.length === 0) {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ name: d, total: 0 }))
    }
    const dayMap = new Map<string, number>()
    reservations.forEach(curr => {
      if (!curr.date) return
      const date = new Date(curr.date).toLocaleDateString('en-US', { weekday: 'short' })
      dayMap.set(date, (dayMap.get(date) || 0) + 1)
    })
    return Array.from(dayMap, ([name, total]) => ({ name, total }))
  }

  const chartData = processChartData()

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep dive into your restaurant's performance.</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-serif text-lg mb-4">Weekly Booking Trends</h3>
        <div className="h-[400px] w-full">
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
    </>
  )
}
