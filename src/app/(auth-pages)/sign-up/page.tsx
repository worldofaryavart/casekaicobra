import { signUpAction, signUpGoogleAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import Input from "@/components/ui/input";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* You can replace this with your app logo */}
          <div className="relative w-12 h-12">
            <Image
              src="/bird-1.png"
              alt="Logo"
              className="object-contain"
              fill
            />
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline transition-all"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>

          {/* Google Sign Up Button */}
          <form action={signUpGoogleAction}>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full mb-4 py-2.5 flex items-center justify-center gap-2"
            >
              <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form className="flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your password"
                  className="w-full"
                  minLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 6 characters
                </p>
              </div>

              <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
                className="w-full mt-2 py-2.5"
              >
                Sign up with Email
              </SubmitButton>

              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}