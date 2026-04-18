import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronLeft } from 'lucide-react'
import { SignInForm } from '@/components/auth/sign-in-form'
import { Button } from '@/components/ui/button'

/** Read AUTH_GOOGLE_* from the environment on each request (not at build time). */
export const dynamic = 'force-dynamic'

export default function SignInPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/40 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2" asChild>
            <Link href="/home">
              <ChevronLeft className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <SignInForm googleEnabled={googleEnabled} />
        </Suspense>
      </main>
    </div>
  )
}
