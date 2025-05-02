import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 px-4 py-8">
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
          <form className="flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Don't have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  name="email" 
                  id="email"
                  placeholder="you@example.com" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link
                    className="text-xs text-primary hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your password"
                  className="w-full"
                  required
                />
              </div>
              
              <SubmitButton 
                pendingText="Signing In..." 
                formAction={signInAction}
                className="w-full mt-2 py-2.5"
              >
                Sign in
              </SubmitButton>
              
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}