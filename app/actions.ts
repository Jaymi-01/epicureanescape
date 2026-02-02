'use server'

import { z } from 'zod'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, setDoc, getDoc, where } from 'firebase/firestore'
import { sendMenuEmail, sendThankYouEmail } from '@/lib/email'
import { initializePayment, verifyTransaction } from '@/lib/paystack'

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
    const amountPerGuest = 5000
    const totalAmount = parseInt(data.guests) * amountPerGuest
    const reference = `RES-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Save to Firebase Firestore 'reservations' collection with 'pending_payment' status
    await addDoc(collection(db, "reservations"), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date.toISOString(),
      time: data.time,
      guests: data.guests,
      requests: data.requests || "",
      status: "pending_payment", // New status field
      totalAmount,
      paymentReference: reference,
      createdAt: new Date().toISOString()
    })

    // CRM: Create/Update Guest Profile (Keep this for record keeping, even if pending)
    try {
      const guestRef = doc(db, "guests", data.email)
      const guestSnap = await getDoc(guestRef)

      if (guestSnap.exists()) {
        await updateDoc(guestRef, {
          name: data.name,
          phone: data.phone,
          lastBooked: new Date().toISOString()
        })
      } else {
        await setDoc(guestRef, {
          email: data.email,
          name: data.name,
          phone: data.phone,
          visits: 0,
          notes: "",
          firstVisit: new Date().toISOString(),
          lastBooked: new Date().toISOString()
        })
      }
    } catch (crmError) {
      console.error("CRM Error (Non-fatal):", crmError)
    }

    // Initialize Paystack Payment
    try {
      const paymentUrl = await initializePayment(data.email, totalAmount, reference)
      return { success: true, paymentUrl }
    } catch (paymentError) {
      console.error("Payment Init Error:", paymentError)
      return { success: false, message: "Reservation saved, but payment failed to initialize. Please contact support." }
    }

  } catch (error) {
    console.error("Reservation Error:", error)
    return { success: false, message: "Failed to save reservation." }
  }
}

export async function verifyPaymentAndConfirmReservation(reference: string) {
  try {
    console.log(`Verifying payment for reference: ${reference}`)

    // 1. Verify with Paystack
    let paymentData
    try {
      paymentData = await verifyTransaction(reference)
      console.log("Paystack verification status:", paymentData.status)
    } catch (err: any) {
      console.error("Paystack API call failed:", err)
      return { success: false, message: `Paystack connection failed: ${err.message}` }
    }

    if (paymentData.status !== 'success') {
      console.error("Payment status is not success:", paymentData.status)
      return { success: false, message: `Payment was not successful. Status: ${paymentData.status}` }
    }

    // 2. Find the reservation in Firestore
    const q = query(collection(db, "reservations"), where("paymentReference", "==", reference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error(`No reservation found for reference: ${reference}`)
      return { success: false, message: `Reservation not found for reference: ${reference}` }
    }

    const reservationDoc = querySnapshot.docs[0]
    const reservationData = reservationDoc.data()

    // 3. Update status to 'confirmed'
    // Check if already confirmed to avoid double emails
    if (reservationData.status === 'confirmed') {
      console.log("Reservation already confirmed.")
      return { success: true, alreadyConfirmed: true }
    }

    await updateDoc(doc(db, "reservations", reservationDoc.id), {
      status: "confirmed",
      paymentId: paymentData.id,
      paidAt: new Date().toISOString()
    })

    // 4. Send Confirmation Email
    try {
      const menuQ = query(collection(db, "menu"), orderBy("category", "asc"))
      const menuSnapshot = await getDocs(menuQ)
      const menuItems = menuSnapshot.docs.map(doc => {
        const d = doc.data()
        return {
          name: d.name,
          price: d.price,
          description: d.description,
          category: d.category
        }
      })

      await sendMenuEmail(reservationData.email, reservationData.name, menuItems)
    } catch (emailError) {
      console.error("Failed to send email after payment:", emailError)
      // Don't fail the whole process if email fails, but log it
    }

    return { success: true }

  } catch (error: any) {
    console.error("Verification Critical Error:", error)
    return { success: false, message: `Server error: ${error.message}` }
  }
}

export async function sendThankYou(reservationId: string, email: string, name: string) {
  try {
    const emailSent = await sendThankYouEmail(email, name)
    
    if (emailSent) {
      return { success: true }
    }
    return { success: false, message: "Failed to send email" }
  } catch (error) {
    console.error("Thank You Action Error:", error)
    return { success: false, message: "Server error" }
  }
}

export async function joinWaitlist(data: {
  name: string
  email: string
  phone: string
  date: Date
}) {
  try {
    await addDoc(collection(db, "waitlist"), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date.toISOString(),
      createdAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error) {
    console.error("Waitlist Error:", error)
    return { success: false, message: "Failed to join waitlist." }
  }
}
