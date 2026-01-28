'use server'

import { z } from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { sendMenuEmail, sendThankYouEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export async function subscribeToNewsletter(prevState: { message: string, success: boolean }, formData: FormData) {
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
      createdAt: new Date().toISOString()
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

export async function saveReservation(data: {
  name: string
  email: string
  phone: string
  date: Date
  time: string
  guests: string
  requests?: string
}) {
  try {
    // Save to Firebase Firestore 'reservations' collection
    await addDoc(collection(db, "reservations"), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date.toISOString(), // Ensure date is stored as string
      time: data.time,
      guests: data.guests,
      requests: data.requests || "",
      createdAt: new Date().toISOString()
    })

    // Fetch latest menu items
    const q = query(collection(db, "menu"), orderBy("category", "asc"))
    const menuSnapshot = await getDocs(q)
    const menuItems = menuSnapshot.docs.map(doc => {
      const d = doc.data()
      return {
        name: d.name,
        price: d.price,
        description: d.description,
        category: d.category
      }
    })

    // Send the exclusive menu email
    console.log("Reservation saved. Now sending email to:", data.email)
    await sendMenuEmail(data.email, data.name, menuItems)

    return { success: true }
  } catch (error) {
    console.error("Reservation Error:", error)
export async function sendThankYou(reservationId: string, email: string, name: string) {
  try {
    const emailSent = await sendThankYouEmail(email, name)
    
    if (emailSent) {
      await updateDoc(doc(db, "reservations", reservationId), {
        thankYouSent: true
      })
      return { success: true }
    }
    return { success: false, message: "Failed to send email" }
  } catch (error) {
    console.error("Thank You Action Error:", error)
    return { success: false, message: "Server error" }
  }
}
