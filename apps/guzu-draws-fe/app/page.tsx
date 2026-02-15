"use client";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col gap-6 justify-center items-center">
      <p className="font-normal font-leckerli text-9xl text-purple-400 uppercase">
        GuzuDraws
      </p>
      <div className=" flex gap-4 ">
        <Link href={"/signin"}>
          <Button
            onClick={() => {}}
            className={
              "py-2 px-8 rounded-full border bg-purple-300 hover:bg-purple-500 text-xl"
            }
          >
            Sign Up
          </Button>
        </Link>
        <Link href={"/signup"}>
          <Button
            onClick={() => {}}
            className={
              "py-2 px-8  rounded-full border bg-amber-50 hover:bg-amber-200 text-xl"
            }
          >
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
