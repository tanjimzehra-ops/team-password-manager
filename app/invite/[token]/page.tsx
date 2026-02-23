"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"
import { LogIn, CheckCircle, XCircle, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"

// Type matching the return value from getByToken query
interface InvitationDetails {
  orgName: string
  role: "admin" | "viewer"
  status: "pending" | "accepted" | "declined" | "expired"
  isExpired: boolean
  expiresAt: number
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const { user, loading: authLoading } = useAuth()

  const invitation = useQuery(api.invitations.getByToken, { token })
  const acceptInvite = useMutation(api.invitations.accept)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Loading state
  if (invitation === undefined || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  // Invalid token
  if (invitation === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has been revoked.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href="/">Go to homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const invite = invitation as InvitationDetails

  // Already accepted
  if (invite.status === "accepted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Already Accepted</CardTitle>
            <CardDescription>
              You have already accepted this invitation to join {invite.orgName}.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/sign-in">Sign in to continue</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Expired
  if (invite.isExpired || invite.status === "expired") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invitation Expired</CardTitle>
            <CardDescription>
              This invitation has expired. Please ask the organisation administrator to send a new invitation.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href="/">Go to homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Not logged in - show sign in prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-slate-900">
          <div className="px-4">
            <div className="flex h-14 items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  J
                </div>
                <span className="font-semibold text-lg text-foreground">Jigsaw</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white">
                  <Mail className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">You&apos;ve been invited!</CardTitle>
              <CardDescription className="space-y-2">
                <p>
                  You have been invited to join <strong>{invite.orgName}</strong> as a{" "}
                  <Badge variant={invite.role === "admin" ? "default" : "secondary"}>
                    {invite.role === "admin" ? "Administrator" : "Viewer"}
                  </Badge>
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p className="text-sm">
                Sign in to accept this invitation and join the organisation.
              </p>
            </CardContent>
            <CardFooter className="justify-center gap-3">
              <Button asChild>
                <Link href="/sign-in">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in to accept
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          creating Preferred Futures
        </footer>
      </div>
    )
  }

  // Valid invitation - show accept/decline
  const handleAccept = async () => {
    setAccepting(true)
    setError(null)
    try {
      await acceptInvite({ token })
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invitation")
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                J
              </div>
              <span className="font-semibold text-lg text-foreground">Jigsaw</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white">
                <Mail className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">You&apos;ve been invited!</CardTitle>
            <CardDescription className="space-y-2">
              <p>
                You have been invited to join <strong>{invite.orgName}</strong> as a{" "}
                <Badge variant={invite.role === "admin" ? "default" : "secondary"}>
                  {invite.role === "admin" ? "Administrator" : "Viewer"}
                </Badge>
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <p className="text-center text-muted-foreground text-sm">
              Accept this invitation to join the organisation and start collaborating.
            </p>
          </CardContent>
          <CardFooter className="justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={accepting}
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={accepting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {accepting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        creating Preferred Futures
      </footer>
    </div>
  )
}
