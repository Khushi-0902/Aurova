'use client'

import Link from 'next/link'
import { useSession } from '@/components/auth/session-provider'
import { signOut } from '@/lib/auth-client'
import { ChevronDown, Loader2, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { copyUserWishlistToAnonymous } from '@/lib/wishlist-storage'
import { cn } from '@/lib/utils'

type AuthNavProps = {
  /** Property site header: compact text. Marketing: warmer cream/chocolate palette. */
  variant?: 'property' | 'marketing'
}

export function AuthNav({ variant = 'property' }: AuthNavProps) {
  const { data: session, status } = useSession()

  const isMarketing = variant === 'marketing'

  if (status === 'loading') {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center" aria-hidden>
        <Loader2 className={cn('size-4 animate-spin', isMarketing ? 'text-[var(--mp-muted)]' : 'text-muted-foreground')} />
      </span>
    )
  }

  if (status === 'authenticated' && session?.user) {
    const label = session.user.name || session.user.email || 'Account'
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-1.5 px-2',
              isMarketing &&
                'text-[var(--mp-chocolate)] hover:bg-white/80 hover:text-[var(--mp-chocolate)] md:px-3',
            )}
          >
            <User className="size-4 shrink-0" aria-hidden />
            <span className="max-w-[140px] truncate hidden sm:inline">{label}</span>
            <ChevronDown className="size-3.5 opacity-60 hidden sm:inline" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              {session.user.name ? (
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
              ) : null}
              <p className="text-xs leading-none text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-destructive focus:text-destructive"
            onSelect={async (e) => {
              e.preventDefault()
              const email = session.user?.email
              if (email) copyUserWishlistToAnonymous(email)
              await signOut({ callbackUrl: '/home' })
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        isMarketing &&
          'text-[var(--mp-muted)] hover:bg-white/70 hover:text-[var(--mp-chocolate)] md:px-3',
      )}
      asChild
    >
      <Link href="/auth/signin">Sign in</Link>
    </Button>
  )
}
