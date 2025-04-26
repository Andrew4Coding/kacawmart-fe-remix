"use client";

import { useNavigate, useOutletContext } from "@remix-run/react";
import { Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { getServerAuthClient } from "~/lib/auth-client";

export default function OtpModule() {
  const [otp, setOtp] = useState<string>("");
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [isSent, setIsSent] = useState(false);

  const data: { email: string; emailVerified: boolean } = useOutletContext();
  const email = data.email;

  const auth = getServerAuthClient();

  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendOtp() {
    if (cooldown > 0) return;

    setIsSent(true);
    setIsSending(true);
    try {
      await auth.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "email-verification",
      });

      toast.success("OTP sent to your email address.");
      setCooldown(30); // Start 30-second cooldown
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  async function verifyOtp() {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await auth.emailOtp.verifyEmail({
        email: email,
        otp,
      });

      if (error) {
        console.error(error);
        toast.error("Invalid OTP. Please try again.");
        return;
      }

      if (data) {
        toast.success("OTP verified successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            OTP Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {data.email}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            variant="default"
            className="w-full"
            onClick={verifyOtp}
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-center w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={sendOtp}
              disabled={cooldown > 0 || isSending}
            >
              {cooldown > 0 ? (
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Resend in {cooldown}s
                </span>
              ) : isSending ? (
                "Sending..."
              ) : (
                `${!isSent ? "Send" : "Resend"} OTP`
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Didn't receive the code? Check your spam folder or request a new
            code after the cooldown.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
