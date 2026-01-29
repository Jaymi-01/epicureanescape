"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-foreground">Admin Guide</h1>
        <p className="text-sm text-muted-foreground">Master your digital restaurant manager.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Features & How-To</CardTitle>
          <CardDescription>Click on a topic to learn more.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="reservations">
              <AccordionTrigger>Reservations Management</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>The <strong>Overview</strong> tab shows all incoming bookings.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Upcoming:</strong> Shows future bookings. Check this daily.</li>
                  <li><strong>History:</strong> Shows past completed or cancelled bookings.</li>
                  <li><strong>Status Actions:</strong> Click the <Badge variant="outline" className="mx-1">...</Badge> button to mark a guest as <em>Seated</em>, <em>Completed</em>, or <em>Cancelled</em>.</li>
                  <li><strong>WhatsApp Reminder:</strong> Click the green chat icon to instantly open a pre-filled WhatsApp message to the guest.</li>
                  <li><strong>Daily Briefing:</strong> Click <strong>Print Briefing</strong> to generate a printer-friendly sheet of today&apos;s bookings for your kitchen and floor staff.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vip">
              <AccordionTrigger>Guest CRM & VIPs</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>The system automatically tracks how many times a guest visits.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Tracking:</strong> Visits only count when you mark a reservation as <strong>"Completed"</strong>.</li>
                  <li><strong>VIP Status:</strong> Guests with more than 3 visits get a <Badge variant="outline" className="mx-1">Crown</Badge> icon next to their name.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="menu">
              <AccordionTrigger>Menu Updates</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>Go to the <strong>Menu</strong> tab in the sidebar.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Real-time:</strong> Any change you make here updates the public website instantly.</li>
                  <li><strong>Emails:</strong> The confirmation email sent to new guests will also automatically include the latest menu items you saved here.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings">
              <AccordionTrigger>Blocking Dates & Backups</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>Go to the <strong>Settings</strong> tab.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Block Dates:</strong> Select a date on the calendar to mark it as "Sold Out". Guests will not be able to book this date.</li>
                  <li><strong>Export Data:</strong> Click "Export All Data" to download a ZIP file containing Excel-ready CSVs of all your reservations and guest lists.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="waitlist">
              <AccordionTrigger>Priority Waitlist</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>If a date is blocked, guests can join the Waitlist.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Check the <strong>Waitlist</strong> tab regularly.</li>
                  <li>If a table opens up, click "Notify" to WhatsApp the guest immediately.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
