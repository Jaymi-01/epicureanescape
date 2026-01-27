'use server'

import { z } from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get('email')

  const validatedFields = schema.safeParse({
    email,
  })

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || "Invalid email",
      success: false,
    }
  }

  try {
    // Save to Firebase Firestore 'subscribers' collection
    await addDoc(collection(db, "subscribers"), {
      email: validatedFields.data.email,
      createdAt: new Date().toISOString() // Saving as ISO string for easier server handling
    })

    return {
      message: "Welcome to the inner circle. You are now subscribed.",
      success: true,
    }
  } catch (error) {
    console.error("Newsletter Error:", error)
    return {
      message: "Something went wrong. Please try again.",
      success: false,
    }
  }
}

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

    return { success: true }
  } catch (error) {
    console.error("Reservation Error:", error)
    return { success: false, message: "Failed to save reservation." }
  }
}