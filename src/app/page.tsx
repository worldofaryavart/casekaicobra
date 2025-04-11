"use client";

import EnhancedChichoreLogoComponent from "@/components/EnhancedLogo";
import { Icons } from "@/components/Icons";
import ChichoreLogoComponent from "@/components/Logo";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Reviews } from "@/components/Reviews";
import { ArrowRight, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Improved logo positioning and styling */}
              <div className="absolute pb-1 lg:pb-2 left-0 hidden lg:flex items-center">
                <ChichoreLogoComponent
                  fontSize="text-3xl lg:text-4xl"
                  textColor="text-indigo-900"
                  letterSpacing="tracking-wider"
                  fontWeight="font-semibold"
                  hoverEffect={true}
                  className="transition-all duration-300"
                />
                <span className="text-indigo-900 text-xl font-serif ml-1 italic">
                  Fashion
                </span>
              </div>

              <h1 className="relative w-fit tracking-tight text-balance mt-14 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Personalized your{" "}
                <span className="bg-indigo-900 px-2 text-white">Fashion</span>{" "}
                your own way
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Wear your story: Where Tradition Meets Trend.{" "}
                <span className="font-medium text-indigo-900">CHICHORÉ</span>{" "}
                brings hyper-personalized fashion that&apos;s as bold and unique
                as you.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-indigo-900" />
                    High-quality, durable material
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-indigo-900" />
                    AI integrated Design Tool
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-indigo-900" />
                    Ultra modern designs
                  </li>
                </div>
              </ul>

              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-4">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/user/user-1.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/user/user-2.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/user/user-3.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/user/user-1.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/user/user-5.jpg"
                    alt="user image"
                  />
                </div>

                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-indigo-900 fill-indigo-900" />
                    <Star className="h-4 w-4 text-indigo-900 fill-indigo-900" />
                    <Star className="h-4 w-4 text-indigo-900 fill-indigo-900" />
                    <Star className="h-4 w-4 text-indigo-900 fill-indigo-900" />
                    <Star className="h-4 w-4 text-indigo-900 fill-indigo-900" />
                  </div>

                  <p>
                    <span className="font-semibold">1,250</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              {/* Decorative elements */}
              <img
                src="/line.png"
                className="absolute w-20 -left-6 -bottom-6 select-none"
                alt="Decorative line"
              />

              {/* Main t-shirt image */}
              <div className="relative w-full h-auto flex justify-center items-center">
                {/* For Next.js Image component */}
                <Image
                  src="/image.png"
                  width={400}
                  height={500}
                  alt="T-shirt product image"
                  className="object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  priority
                />
              </div>

              {/* Additional decorative element */}
              <img
                src="/your-image.png"
                className="absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
                alt="Decorative element"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-slate-100 grainy-dark py-24">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
              What our{" "}
              <span className="relative px-2">
                customers{" "}
                <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-indigo-500" />
              </span>{" "}
              say
            </h2>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              <div className="flex gap-4 mt-2">
                <img
                  src="/user/user-1.png"
                  alt="user"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">Jonathan</p>
                  <div className="flex gap-1.5 items-center text-zinc-600">
                    <Check className="h-4 w-4 stroke-[3px] text-indigo-900" />
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
              </div>
              <div>
                <p>
                  The t-shirt fabric feels premium and I&apos;ve received
                  multiple compliments on the design. I&apos;ve worn and washed
                  it several times over the past two months and{" "}
                  <span className="p-0.5 bg-slate-800 text-white">
                    the print is still vibrant and crisp
                  </span>
                  . With my previous custom shirts, the design started fading
                  after a few washes. The fit is perfect and the material
                  breathes well. Absolutely love it.
                </p>
              </div>
            </div>
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              <div className="flex gap-4 mt-2">
                <img
                  src="/user/user-2.png"
                  alt="user"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">Jessica</p>
                  <div className="flex gap-1.5 items-center text-zinc-600">
                    <Check className="h-4 w-4 stroke-[3px] text-indigo-900" />
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
                <Star className="h-5 w-5 text-indigo-900 fill-indigo-900" />
              </div>
              <div>
                <p>
                  I&apos;m pretty rough on my clothes during workouts and
                  outdoor activities, and most custom shirts don&apos;t hold up
                  well. This one maintains its shape and the fabric doesn't pill
                  or thin out. The design is gorgeous and{" "}
                  <span className="p-0.5 bg-slate-800 text-white">
                    looks as fresh as day one even after six months of regular
                    wear
                  </span>
                  . The colors remain true and the fit is still perfect.
                  Definitely ordering more designs.
                </p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        <div className="pt-16">
          <Reviews />
        </div>
      </section>
      <section>
        <MaxWidthWrapper className="py-24">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="tracking-tight font-bold text-4xl md:text-5xl text-gray-900 inline-block mx-auto">
                Upload your photo and get your{" "}
                <span className="relative px-2 bg-indigo-900 text-white">
                  own design
                </span>{" "}
                now
              </h2>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
              <img
                src="/arrow.png"
                className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
              />

              <div className="relative h-60 md:h-80 w-full md:justify-self-end max-w-xs rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                <img
                  src="/teedesigns/kathakali_mask.png"
                  className="rounded-md object-contain bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
                />
              </div>

              <div className="relative h-96 md:h-full w-full max-w-md">
                <img
                  src="/models/kathakali_mask_man.png"
                  className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
                />
              </div>
            </div>
          </div>

          <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit">
            <li className="w-fit">
              <Check className="h-5 w-5 text-indigo-900 inline mr-1.5" />
              Premium cotton blend material
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-indigo-900 inline mr-1.5" />
              Fade-resistant vibrant printing
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-indigo-900 inline mr-1.5" />
              Machine washable, keeps shape
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-indigo-900 inline mr-1.5" />2 year
              print warranty
            </li>

            <div className="flex justify-center mt-4">
              <Link
                className="flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-6 w-full sm:w-auto"
                href="/configure/upload"
              >
                Get your t-shirt now <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
