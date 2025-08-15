"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import CreateSwapOffer from "./create-swap-offer";
import TakeOffer from "./take-offer";

export default function SwapDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Decentralized Token Swaps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create and accept token swap offers on Solana with zero slippage
              and full control
            </p>
          </div>
          <Tabs defaultValue="make-offer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-1">
              <TabsTrigger
                value="make-offer"
                className="rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                Make an Offer
              </TabsTrigger>
              <TabsTrigger
                value="take-offer"
                className="rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                Take an Offer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="make-offer" className="space-y-6">
              <CreateSwapOffer />
            </TabsContent>
            <TabsContent value="take-offer" className="space-y-6">
              <TakeOffer />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
