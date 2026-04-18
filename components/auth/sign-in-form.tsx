'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/auth-client'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

type SignInFormProps = {
  googleEnabled: boolean
}

export function SignInForm({ googleEnabled }: SignInFormProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/home'
  const error = searchParams.get('error')

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function sendOtp() {
    setSending(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string | Record<string, string[]> }
      if (!res.ok) {
        const msg =
          typeof data.error === 'string'
            ? data.error
            : 'Could not send code. Check your details and try again.'
        toast.error(msg)
        return
      }
      toast.success('Check your email for the 6-digit code.')
      setStep('otp')
      setOtp('')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setSending(false)
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code from your email.')
      return
    }
    setVerifying(true)
    try {
      const result = await signIn('email-otp', {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        otp,
        redirect: false,
        callbackUrl,
      })
      if (result && typeof result === 'object' && (!result.ok || result.error)) {
        toast.error('Invalid or expired code. Request a new one.')
        return
      }
      window.location.href = callbackUrl
    } catch {
      toast.error('Sign-in failed. Try again.')
    } finally {
      setVerifying(false)
    }
  }

  async function signInWithGoogle() {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      toast.error('Google sign-in failed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-serif text-2xl">Sign in to Aurova</CardTitle>
        <CardDescription>
          Save homes across devices with your account. Email code or Google — your choice.
        </CardDescription>
        {error ? (
          <p className="text-sm text-destructive pt-1" role="alert">
            Sign-in was cancelled or failed. Please try again.
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-8">
        {googleEnabled ? (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 h-11"
              onClick={() => void signInWithGoogle()}
              disabled={googleLoading}
            >
              {googleLoading ? <Loader2 className="size-4 animate-spin" /> : null}
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or use email</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Next.js does <span className="font-medium text-foreground">not</span> read{' '}
            <span className="font-mono">.env.example</span>. Add{' '}
            <span className="font-mono">AUTH_GOOGLE_ID</span> and <span className="font-mono">AUTH_GOOGLE_SECRET</span>{' '}
            to <span className="font-mono">.env.local</span>, then restart the dev server.
          </p>
        )}

        {step === 'details' ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              void sendOtp()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2 gradient-primary text-primary-foreground" disabled={sending}>
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              Email me a code
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              We sent a code to <span className="font-medium text-foreground">{email}</span>
            </p>
            <div className="flex flex-col items-center gap-2">
              <Label className="sr-only">One-time code</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('details')
                  setOtp('')
                }}
              >
                Back
              </Button>
              <Button
                type="button"
                className="flex-1 gradient-primary text-primary-foreground"
                onClick={() => void verifyOtp()}
                disabled={verifying || otp.length !== 6}
              >
                {verifying ? <Loader2 className="size-4 animate-spin" /> : null}
                Verify and sign in
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Button variant="link" className="h-auto p-0 text-xs" asChild>
            <Link href="/home">Continue without signing in</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  )
}
