import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-rose-50  to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-200/25 to-orange-200/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-8 bg-gradient-to-r from-violet-100/80 via-purple-100/80 to-fuchsia-100/80 text-violet-700 border border-violet-200/50 rounded-full px-6 py-3 backdrop-blur-sm shadow-lg">
            <Star className="w-5 h-5 mr-2 animate-pulse" />
            🚀 The Future of DeFi Trading is Here
          </Badge>

          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 mb-8 leading-tight">
            Trade Like a
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent block animate-pulse">
              DeFi Legend
            </span>
          </h1>

          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            🔥 Create{" "}
            <span className="text-violet-600 font-bold">explosive</span>{" "}
            peer-to-peer token swaps on Solana.
            <br />⚡ Zero slippage. Maximum profits.{" "}
            <span className="text-fuchsia-600 font-bold">Pure DeFi magic.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={"/dashboard"}>
              <Button className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-2xl px-12 py-6 text-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transform">
                🚀 Start Dominating Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Why PeerXchange is{" "}
            <span className="text-violet-600">Unstoppable</span> 🔥
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Experience the most advanced P2P trading platform that's
            revolutionizing DeFi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 transform group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold">
                ⚡ Zero Slippage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg">
                <strong>Guaranteed exact prices!</strong> No more MEV attacks or
                surprise losses. Your price is locked in stone! 💎
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 transform group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold">
                🛡️ Fort Knox Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg">
                <strong>Military-grade protection</strong> with Solana's
                bulletproof blockchain. Your funds are safer than gold! 🏦
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 transform group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold">🤝 P2P Power</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg">
                <strong>Direct trader connections!</strong> Cut out the
                middleman and keep ALL your profits. Trade like a boss! 👑
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 transform group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold">
                💰 Micro Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg">
                <strong>Keep your gains!</strong> Solana's lightning-fast,
                dirt-cheap transactions mean more money in YOUR pocket! 💸
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Become a <span className="text-fuchsia-600">Trading Ninja</span> in
            3 Steps 🥷
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            So simple, even your grandma could make bank on DeFi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center group">
            <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-black text-white">1</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              🔌 Connect & Conquer
            </h3>
            <p className="text-lg text-gray-700">
              Link your Solana wallet (Phantom, Solflare, etc.) and unlock the{" "}
              <strong>trading universe</strong>! Ready in 5 seconds! ⚡
            </p>
          </div>

          <div className="text-center group">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-black text-white">2</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Hunt or Create Deals
            </h3>
            <p className="text-lg text-gray-700">
              Browse <strong>killer deals</strong> from other traders, or create
              your own <strong>irresistible offers</strong>. The market is your
              playground! 🎪
            </p>
          </div>

          <div className="text-center group">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-black text-white">3</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              💥 Execute & Profit
            </h3>
            <p className="text-lg text-gray-700">
              Hit that button and watch the <strong>magic happen!</strong> Smart
              contracts do the heavy lifting while you count your gains! 🏆
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 border-0 shadow-3xl rounded-3xl text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="p-16 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-5xl font-black mb-8">
                    Ready to <span className="text-yellow-300">Dominate</span>{" "}
                    DeFi? 🚀
                  </h2>
                  <p className="text-xl mb-10 text-purple-100 font-medium">
                    Join the <strong>elite traders</strong> who've already
                    discovered the secret weapon of P2P swaps.
                    <span className="text-yellow-300">
                      {" "}
                      Your fortune awaits!
                    </span>{" "}
                    💰
                  </p>
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-7 h-7 text-green-300" />
                      <span className="text-lg font-medium">
                        🎯 No BS registration - Jump in instantly!
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-7 h-7 text-green-300" />
                      <span className="text-lg font-medium">
                        ⚡ Lightning-fast wallet connection
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-7 h-7 text-green-300" />
                      <span className="text-lg font-medium">
                        💎 Start making legendary trades NOW
                      </span>
                    </div>
                  </div>
                  <Button className="bg-white text-violet-600 hover:bg-gray-50 rounded-2xl px-12 py-6 text-xl font-bold transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform">
                    🔥 Unleash the Beast
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="w-80 h-80 bg-white/15 rounded-3xl backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/25 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <p className="text-lg text-purple-100 font-bold">
                          🚀 Turbo-Charged Trading
                        </p>
                        <p className="text-sm text-purple-200 mt-2">
                          Join 50K+ traders already winning!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/70 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                PeerXchange
              </span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <a
                href="#"
                className="hover:text-violet-600 transition-colors font-medium"
              >
                Privacy Shield 🛡️
              </a>
              <a
                href="#"
                className="hover:text-violet-600 transition-colors font-medium"
              >
                Terms of Power ⚡
              </a>
              <a
                href="#"
                className="hover:text-violet-600 transition-colors font-medium"
              >
                Master Docs 📚
              </a>
              <a
                href="#"
                className="hover:text-violet-600 transition-colors font-medium"
              >
                Elite Support 👑
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 font-medium">
            © 2024 PeerXchange.{" "}
            <span className="text-violet-600">
              Powered by Solana's lightning network
            </span>{" "}
            ⚡
            <br />
            <span className="text-sm">
              Built for legends, by legends. Trade responsibly! 🚀
            </span>
            <p>
              {" "}
              developed by{" "}
              <Link href={"https://x.com/piyushsainii"} target="_blank">
                @piyushhsainii
              </Link>{" "}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
