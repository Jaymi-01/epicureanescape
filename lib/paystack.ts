export const initializePayment = async (email: string, amount: number, reference: string) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is missing")
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Paystack Init Error:", errorData)
    throw new Error("Failed to initialize payment")
  }

  const data = await response.json()
  return data.data.authorization_url
}

export const verifyTransaction = async (reference: string) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is missing")
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to verify payment")
  }

  const data = await response.json()
  return data.data
}
