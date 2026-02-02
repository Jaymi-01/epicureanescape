"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Users, Clock, Utensils, Loader2, HelpCircle } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { saveReservation, joinWaitlist } from "@/app/actions"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  date: z.date({
    message: "A date of reservation is required.",
  }),
  time: z.string({
    message: "Please select a time.",
  }),
  guests: z.string({
    message: "Please select number of guests.",
  }),
  requests: z.string().optional(),
})

export function ReservationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  
  // Waitlist State
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [wlName, setWlName] = useState("")
  const [wlEmail, setWlEmail] = useState("")
  const [wlPhone, setWlPhone] = useState("")
  const [wlDate, setWlDate] = useState<Date | undefined>(undefined)
  const [wlLoading, setWlLoading] = useState(false)

  const handleJoinWaitlist = async () => {
    if (!wlName || !wlEmail || !wlPhone || !wlDate) {
      toast.error("Please fill in all fields")
      return
    }
    setWlLoading(true)
    const res = await joinWaitlist({ name: wlName, email: wlEmail, phone: wlPhone, date: wlDate })
    setWlLoading(false)
    if (res.success) {
      toast.success("Added to waitlist!")
      setWaitlistOpen(false)
      // Reset form
      setWlName("")
      setWlEmail("")
      setWlPhone("")
      setWlDate(undefined)
    } else {
      toast.error("Failed to join waitlist")
    }
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      requests: "",
    },
  })

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "reservations"), (doc) => {
      if (doc.exists()) {
        setBlockedDates(doc.data().blockedDates || [])
      }
    })
    return () => unsub()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await saveReservation(values)
      
      if (result.success && result.paymentUrl) {
        // Redirect to Paystack
        window.location.href = result.paymentUrl
      } else {
        setIsLoading(false)
        toast.error(result.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("An error occurred. Please try again.")
    }
  }

  if (isSubmitted) {
    // Note: This state might not be reached if we redirect, 
    // but useful if we handle success via return params later.
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto border-2 shadow-xl bg-card text-center py-12">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-serif">Reservation Confirmed</CardTitle>
            <CardDescription className="text-lg">
              Thank you for choosing Epicurean Escape by Tiara. 
              <br /><br />
              <span className="font-semibold text-primary">Check your email!</span> We've sent you the exclusive menu and price list.
            </CardDescription>
            <Button asChild className="mt-4">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-2 shadow-xl bg-card">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Image 
            src="/eet-logo.jpg" 
            alt="Epicurean Escape Logo" 
            width={120} 
            height={120} 
            className="rounded-full border-2 border-primary"
          />
        </div>
        <CardTitle className="text-4xl font-serif text-foreground">Secure Your Table</CardTitle>
        <CardDescription className="text-lg font-sans">
          Entry to Epicurean Escape is by reservation only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-white border-border focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} className="bg-white border-border focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Phone Number</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 text-sm">
                        <p>We use your number to send a one-time reservation reminder and to contact you in case of any last-minute changes to your booking.</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input placeholder="+234..." {...field} className="bg-white border-border focus:ring-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 text-sm" align="start">
                          <p>Grayed out dates are either fully booked or the restaurant is closed for a private event.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-border bg-white hover:bg-secondary/20",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setCalendarOpen(false)
                          }}
                          disabled={(date) =>
                            date < getDateWithoutTime(new Date()) || 
                            blockedDates.some(blocked => getDateWithoutTime(new Date(blocked)).getTime() === getDateWithoutTime(date).getTime())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <button 
                      type="button"
                      onClick={() => setWaitlistOpen(true)}
                      className="text-xs text-primary underline mt-2 text-left hover:text-primary/80"
                    >
                      Desired date fully booked? Join Waitlist.
                    </button>
                  </FormItem>
                )}
              />

              <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Priority Waitlist</DialogTitle>
                    <DialogDescription>
                      We will notify you immediately if a table opens up for your desired date.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <FormLabel>Preferred Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !wlDate && "text-muted-foreground")}>
                            {wlDate ? format(wlDate, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={wlDate} onSelect={setWlDate} disabled={(date) => date < getDateWithoutTime(new Date())} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <FormLabel>Name</FormLabel>
                      <Input value={wlName} onChange={(e) => setWlName(e.target.value)} placeholder="Your Name" />
                    </div>
                    <div className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <Input value={wlEmail} onChange={(e) => setWlEmail(e.target.value)} placeholder="Email Address" />
                    </div>
                    <div className="grid gap-2">
                      <FormLabel>Phone</FormLabel>
                      <Input value={wlPhone} onChange={(e) => setWlPhone(e.target.value)} placeholder="Phone Number" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleJoinWaitlist} disabled={wlLoading} className="bg-primary">
                      {wlLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join Waitlist"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-border">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "10:00", "11:00", "12:00", "13:00", "14:00", 
                          "15:00", "16:00", "17:00", "18:00", "19:00", 
                          "20:00", "21:00", "22:00"
                        ].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-border">
                          <SelectValue placeholder="Number of guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'Guest' : 'Guests'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Explanation Section */}
            {form.watch("guests") && (
              <div className="bg-secondary/10 border border-secondary p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reservation Fee (₦5,000 × {form.watch("guests")})</span>
                  <span className="font-semibold">₦{(parseInt(form.watch("guests")) * 5000).toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                  <p>To secure your reservation, a non-refundable deposit of ₦5,000 per guest is required. This amount will be deducted from your final bill.</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Input placeholder="Allergies, special occasions, etc." {...field} className="bg-white border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 text-lg font-serif bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                form.watch("guests") 
                  ? `Proceed to Payment (₦${(parseInt(form.watch("guests")) * 5000).toLocaleString()})`
                  : "Complete Reservation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </motion.div>
  )
}

function getDateWithoutTime(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
