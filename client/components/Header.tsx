"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={"/"}>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-sans bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">
              PeerXchange
            </h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4 gap-4">
          <Link
            href={"/dashboard"}
            className="rounded-xl hover:bg-purple-50 transition-all duration-300 text-base tracking-wider text-gray-900 font-semibold hover:border hover:border-gray-800 px-3 py-1 hover:shadow-sm hover:shadow-gray-800"
          >
            Dashboard
          </Link>
          <WalletMultiButton className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 px-2 p-2" />
        </div>
      </div>
    </header>
  );
};

export default Header;
