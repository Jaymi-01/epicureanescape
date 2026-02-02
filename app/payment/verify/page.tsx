'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyPaymentAndConfirmReservation } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function VerifyContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      setMessage('No payment reference found.')
      return
    }

    verifyPaymentAndConfirmReservation(reference)
      .then((res) => {
        if (res.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setMessage(res.message || "Payment verification failed.")
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage("An unexpected error occurred.")
      })
  }, [reference])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-xl bg-card text-center py-12">
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <CardTitle className="text-2xl font-serif">Verifying Payment</CardTitle>
                <CardDescription>Please wait while we confirm your reservation...</CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                </div>
                <CardTitle className="text-3xl font-serif">Payment Successful!</CardTitle>
                <CardDescription className="text-lg">
                  Your reservation is now confirmed.
                  <br /><br />
                  <span className="font-semibold text-primary">Check your email!</span> We've sent you the exclusive menu and details.
                </CardDescription>
                <Button asChild className="mt-4">
                  <Link href="/">Return Home</Link>
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-serif">Verification Failed</CardTitle>
                <CardDescription className="text-lg text-destructive">
                  {message}
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-2">Ref: {reference}</p>
                <div className="flex gap-4 justify-center mt-4">
                  <Button asChild variant="outline">
                    <Link href="/reserve">Try Again</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/help">Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
