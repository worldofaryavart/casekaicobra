import {
  ArrowRight,
  ShoppingBag,
  ShoppingBagIcon,
  StoreIcon,
} from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ChichoreLogoComponent from "./Logo";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

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
                  SignOut
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Admin ✨
                  </Link>
                ) : null}
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
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>

                <Link
                  href="/api/auth/login"
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
