"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, ShoppingBagIcon, X } from "lucide-react";
import { buttonVariants } from "./ui/button";

type MobileNavProps = {
  user: any; // Replace with your actual user type
  isAdmin: boolean;
};

const MobileNav = ({ user, isAdmin }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 text-indigo-900"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-14 inset-x-0 bg-white shadow-lg p-4 flex flex-col space-y-4 z-50">
          {user ? (
            <>
              <Link
                href="/api/auth/logout"
                className={buttonVariants({
                  size: "default",
                  variant: "ghost",
                  className: "w-full justify-center",
                })}
                onClick={() => setIsOpen(false)}
              >
                SignOut
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-750 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Shop
                <ShoppingBagIcon className="ml-1.5 h-5 w-5" />
              </Link>
              <Link
                href="/configure/upload"
                className={buttonVariants({
                  size: "default",
                  className:
                    "w-full justify-center bg-indigo-900 hover:bg-indigo-950",
                })}
                onClick={() => setIsOpen(false)}
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
                  size: "default",
                  variant: "ghost",
                  className: "w-full justify-center",
                })}
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>

              <Link
                href="/login"
                className={buttonVariants({
                  size: "default",
                  variant: "ghost",
                  className: "w-full justify-center",
                })}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/shop"
                className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-750 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Shop
                <ShoppingBagIcon className="ml-1.5 h-5 w-5" />
              </Link>
              <Link
                href="/configure/upload"
                className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-750 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Get t-shirt
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MobileNav;
