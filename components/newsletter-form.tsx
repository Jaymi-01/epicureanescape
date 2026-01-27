'use client'

import { useActionState } from 'react' // Updated hook for Next.js 15+ / React 19
import { Button } from "@/components/ui/button"
import { subscribeToNewsletter } from "@/app/actions"
import { useEffect } from "react"
import { Loader2, Check } from "lucide-react"

const initialState = {
  message: '',
  success: false,
}

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required
          disabled={state.success}
          className="bg-white/10 border border-white/20 px-4 py-2 rounded flex-1 outline-none focus:border-primary text-sm disabled:opacity-50" 
        />
        <Button 
          disabled={isPending || state.success}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 h-auto text-sm min-w-[80px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state.success ? (
            <Check className="h-4 w-4" />
          ) : (
            "Join"
          )}
        </Button>
      </div>
      {state.message && (
        <p className={`text-xs ${state.success ? 'text-green-400' : 'text-red-400'}`}>
          {state.message}
        </p>
      )}
    </form>
  )
}
