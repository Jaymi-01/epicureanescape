'use server'

import { z } from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { sendMenuEmail } from '@/lib/email'

const schema = z.object({
// ... (rest of the file)
export async function saveReservation(data: any) {
  try {
    // Save to Firebase Firestore 'reservations' collection
    await addDoc(collection(db, "reservations"), {
      name: data.name,
      email: data.email,
      date: data.date.toISOString(), // Ensure date is stored as string
      time: data.time,
      guests: data.guests,
      requests: data.requests || "",
      createdAt: new Date().toISOString()
    })

    // Send the exclusive menu email
    await sendMenuEmail(data.email, data.name)

    return { success: true }
  } catch (error) {
    console.error("Reservation Error:", error)
    return { success: false, message: "Failed to save reservation." }
  }
}