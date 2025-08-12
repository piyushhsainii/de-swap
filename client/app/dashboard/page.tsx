"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Wallet, ArrowUpDown, Clock, User, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import CreateSwapOffer from "./create-swap-offer";

// Mock data for demonstration
const mockTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    logo: "/placeholder.svg?height=24&width=24",
  },
  { symbol: "SRM", name: "Serum", logo: "/placeholder.svg?height=24&width=24" },
];

const mockOffers = [
  {
    id: 1,
    tokenFrom: "SOL",
    tokenTo: "USDC",
    amount: "10.5",
    price: "95.50",
    expiry: "2h 30m",
    maker: "7xKX...9mPq",
  },
  {
    id: 2,
    tokenFrom: "USDC",
    tokenTo: "RAY",
    amount: "500",
    price: "2.45",
    expiry: "1h 15m",
    maker: "4nBv...7kLm",
  },
  {
    id: 3,
    tokenFrom: "RAY",
    tokenTo: "SOL",
    amount: "200",
    price: "0.025",
    expiry: "45m",
    maker: "9pQw...3xRt",
  },
];

export default function SwapDashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsLoading(false);
      toast("Wallet Connected");
    }, 1500);
  };

  const handleSubmitOffer = async () => {
    setIsLoading(true);
    // Simulate offer submission
    setTimeout(() => {
      setIsLoading(false);
      toast("Offer Created", {
        description: "Your swap offer has been submitted to the blockchain",
      });
    }, 2000);
  };

  const handleTakeOffer = async (offerId: number) => {
    setIsLoading(true);
    // Simulate taking offer
    setTimeout(() => {
      setIsLoading(false);
      toast("Offer Accepted", {
        description: "Transaction submitted successfully",
      });
    }, 2000);
  };

  const filteredOffers = mockOffers.filter(
    (offer) =>
      offer.tokenFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.tokenTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Available Offers
                  </CardTitle>
                  <CardDescription>
                    Browse and accept swap offers from other users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl border-gray-200"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Sort by Price</SelectItem>
                        <SelectItem value="amount">Sort by Amount</SelectItem>
                        <SelectItem value="expiry">Sort by Expiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Token Pair</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Expires In</TableHead>
                          <TableHead>Maker</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOffers.map((offer) => (
                          <TableRow
                            key={offer.id}
                            className="hover:bg-gray-50/50 transition-colors duration-200"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="rounded-lg">
                                  {offer.tokenFrom} → {offer.tokenTo}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {offer.amount}
                            </TableCell>
                            <TableCell>${offer.price}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-orange-600">
                                <Clock className="w-4 h-4" />
                                <span>{offer.expiry}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-sm">
                                  {offer.maker}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleTakeOffer(offer.id)}
                                disabled={!isWalletConnected || isLoading}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                              >
                                Take Offer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile card layout */}
                  <div className="md:hidden space-y-4">
                    {filteredOffers.map((offer) => (
                      <Card
                        key={offer.id}
                        className="bg-white/60 backdrop-blur-sm border-gray-200 rounded-2xl hover:shadow-md transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline" className="rounded-lg">
                              {offer.tokenFrom} → {offer.tokenTo}
                            </Badge>
                            <div className="flex items-center space-x-1 text-orange-600 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{offer.expiry}</span>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">
                                {offer.amount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">
                                ${offer.price}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Maker:</span>
                              <span className="font-mono text-sm">
                                {offer.maker}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleTakeOffer(offer.id)}
                            disabled={!isWalletConnected || isLoading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                          >
                            Take Offer
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
