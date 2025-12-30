import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  verifyEmailThunk,
  resendVerificationCodeThunk
} from "../features/userSlice.js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"

export default function EmailVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user)
  const email = currentUser?.email

  const [code, setCode] = useState("")

  const handleVerify = async () => {
    if (!email || code.length !== 6) return

    try {
      await dispatch(verifyEmailThunk({ email, code })).unwrap();
      toast.success("Your email has been successfully verified.");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Failed to verify email")
    }
  }

  const handleResend = async () => {
    if (!email) return

    try {
      await dispatch(resendVerificationCodeThunk({ email })).unwrap();
      toast.success("successfully resend verification code")
    } catch (err) {
      toast.error(err?.message || "Failed to resend verification code")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Verify your email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={!email || code.length !== 6}
          >
            Verify Email
          </Button>

          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={handleResend}
            disabled={!email}
          >
            Resend code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
