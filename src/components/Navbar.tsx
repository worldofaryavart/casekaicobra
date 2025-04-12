"use client";

import { ArrowRight, ShoppingBagIcon } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import ChichoreLogoComponent from "./Logo";
import MobileNav from "./MobileNav";
import { useUser } from "@/hooks/useUser";

const Navbar = () => {
  const { user, loading } = useUser();

  // Use a fallback or loading state if desired
  if (loading) return <p>Loading...</p>;

  // Make sure the admin email is set as an environment variable with the NEXT_PUBLIC_ prefix
  const isAdmin =
    user?.email?.toLowerCase() ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  console.log("user is", user?.email, "isAdmin is", isAdmin);

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 items-center">
            <ChichoreLogoComponent
              fontSize="text-2xl md:text-3xl"
              textColor="text-indigo-900"
              letterSpacing="tracking-wider"
              fontWeight="font-medium"
              hoverEffect={true}
              className="transition-all duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex h-full items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign Out
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Admin ✨
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-1 bg-indigo-700 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Shop
                  <ShoppingBagIcon className="ml-1.5 h-5 w-5" />
                </Link>
                <Link
                  href="/configure/upload"
                  className="flex items-center justify-center gap-1 bg-indigo-700 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get t-shirt
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>

                <Link
                  href="/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>

                <div className="h-8 w-px bg-zinc-200" />
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-1 bg-indigo-700 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Shop
                  <ShoppingBagIcon className="ml-1.5 h-5 w-5" />
                </Link>
                <Link
                  href="/configure/upload"
                  className="flex items-center justify-center gap-1 bg-indigo-700 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get t-shirt
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <MobileNav user={user} isAdmin={isAdmin} />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
