"use client";

import { useState, useMemo } from "react";
import { Plus, CheckCircle, Loader2, ArrowUpDown } from "lucide-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomTokenDialog from "./custom-token-dialog";
import { Program } from "@coral-xyz/anchor";
import IDL from "../../../programs/swap-program/src/IDL/swap_program.json";
import { SwapProgram } from "../../../target/types/swap_program";
// Mock data for demonstration
const defaultTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    address: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logo: "🟣",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    logo: "🔵",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    decimals: 6,
    logo: "⚡",
  },
];

// Mock offers data
const mockOffers = [
  {
    id: "1",
    tokenFrom: "SOL",
    tokenTo: "USDC",
    amount: 10,
    price: 180,
    expires: "2h",
    user: "0x1234...5678",
  },
  {
    id: "2",
    tokenFrom: "USDC",
    tokenTo: "RAY",
    amount: 1000,
    price: 2.5,
    expires: "1d",
    user: "0xabcd...efgh",
  },
];

export default function SwapDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState(defaultTokens);
  const [customTokenDialog, setCustomTokenDialog] = useState(false);
  const wallet = useWallet();
  // Custom token form state
  const [customToken, setCustomToken] = useState({
    address: "",
    symbol: "",
    name: "",
    decimals: "",
    logo: "",
  });

  // Validation state
  const [validationState, setValidationState] = useState<{
    isValidating: boolean | null;
    isValid: boolean | null;
    error: any;
    tokenInfo: {
      supply: string;
      decimals: number;
      isInitialized: boolean;
      mintAuthority: string | null;
      freezeAuthority: string | null;
    } | null;
  }>({
    isValidating: false,
    isValid: null,
    error: null,
    tokenInfo: null,
  });

  // Create offer state
  const [offerFrom, setOfferFrom] = useState("");
  const [offerTo, setOfferTo] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const [submitState, setSubmitState] = useState<{
    isSubmitting: boolean;
    success: boolean;
    error: any;
  }>({
    isSubmitting: false,
    success: false,
    error: null,
  });

  // Memoized filtered offers to prevent unnecessary re-renders
  const filteredOffers = useMemo(
    () =>
      mockOffers.filter(
        (offer) =>
          offer.tokenFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.tokenTo.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  // Token validation function
  const validateToken = async (address: any) => {
    // Reset validation state
    setValidationState({
      isValidating: true,
      isValid: null,
      error: null,
      tokenInfo: null,
    });

    try {
      // Step 1: Validate format
      let pubkey;
      try {
        pubkey = new PublicKey(address);
      } catch {
        throw new Error("Invalid Solana address format");
      }

      // Step 2: Fetch mint info from devnet
      const mintInfo = await getMint(connection, pubkey);

      // If we reach here without throwing, token exists
      setValidationState({
        isValidating: false,
        isValid: true,
        error: null,
        tokenInfo: {
          supply: mintInfo.supply.toString(),
          decimals: mintInfo.decimals,
          isInitialized: mintInfo.isInitialized,
          mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
          freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
        },
      });
    } catch (err) {
      setValidationState({
        isValidating: false,
        isValid: false,
        error: "Failed to validate token",
        tokenInfo: null,
      });
    }
  };

  const handleTokenAddressChange = (address: any) => {
    setCustomToken((prev) => ({ ...prev, address }));

    // Simple timeout for validation - you could also use useEffect with debouncing
    setTimeout(() => validateToken(address), 800);
  };

  const handleImportCustomToken = async () => {
    if (
      !customToken.address ||
      !customToken.symbol ||
      validationState.isValid !== true
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const newToken = {
        symbol: customToken.symbol.toUpperCase(),
        name: customToken.name || customToken.symbol,
        address: customToken.address,
        decimals: Number.parseInt(customToken.decimals) || 9,
        logo: customToken.logo || "🪙",
      };

      // Check if token already exists
      const existingToken = tokens.find((t) => t.address === newToken.address);
      if (existingToken) {
        throw new Error("Token already imported");
      }

      setTokens((prev) => [...prev, newToken]);

      // Reset form
      setCustomToken({
        address: "",
        symbol: "",
        name: "",
        decimals: "",
        logo: "",
      });
      setValidationState({
        isValidating: false,
        isValid: null,
        error: null,
        tokenInfo: null,
      });
      setCustomTokenDialog(false);
    } catch (error) {
      setValidationState((prev) => ({
        ...prev,
        error: "Something went wrong",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerFrom || !offerTo || !offerAmount || !offerPrice) {
      return;
    }
    setSubmitState({ isSubmitting: true, success: false, error: null });
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const program: Program<SwapProgram> = new Program(IDL, {
        connection: connection,
      });
      program.methods;
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        success: false,
        error: "Failed to create offer. Please try again.",
      });
    }
  };

  const handleSwapTokens = () => {
    const tempFrom = offerFrom;
    const tempAmount = offerAmount;
    const tempPrice = offerPrice;

    setOfferFrom(offerTo);
    setOfferTo(tempFrom);
    setOfferAmount(tempPrice);
    setOfferPrice(tempAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-2xl p-6">
            <h2 className="text-2xl text-gray-900 flex items-center gap-2 font-bold">
              Create Swap Offer
              <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </h2>
            <p className="text-gray-600 mt-1">
              Set up your token swap offer for others to accept
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:block hidden">
                <button
                  onClick={handleSwapTokens}
                  disabled={!offerFrom && !offerTo}
                  className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-gray-200 hover:border-blue-300 disabled:opacity-50"
                >
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  You're offering
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    FROM
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={offerFrom}
                      onChange={(e) => setOfferFrom(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 p-3"
                    >
                      <option value="">Select token to offer</option>
                      {tokens.map((token) => (
                        <option key={token.address} value={token.symbol}>
                          {token.logo} {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setCustomTokenDialog(true)}
                      className="p-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200 hover:scale-105 border border-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <input
                  placeholder="Amount"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50 border border-purple-700"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  You want
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    TO
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={offerTo}
                      onChange={(e) => setOfferTo(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 p-3"
                    >
                      <option value="">Select token you want</option>
                      {tokens.map((token) => (
                        <option key={token.address} value={token.symbol}>
                          {token.logo} {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setCustomTokenDialog(true)}
                      className="p-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200 hover:scale-105 border border-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <input
                  placeholder="Tokens wanted"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  disabled={!wallet.connected}
                  className="w-full rounded-xl border border-purple-700 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmitOffer}
                disabled={
                  !wallet.connected ||
                  !offerFrom ||
                  !offerTo ||
                  !offerAmount ||
                  !offerPrice ||
                  submitState.isSubmitting ||
                  offerFrom === offerTo
                }
                className={`w-full text-white rounded-xl py-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  submitState.success
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }`}
              >
                {submitState.isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Offer...
                  </span>
                ) : submitState.success ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Offer Created Successfully!
                  </span>
                ) : (
                  "Create Swap Offer"
                )}
              </button>

              {offerFrom === offerTo && offerFrom && (
                <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg">
                  ⚠️ Cannot create offer for the same token
                </p>
              )}

              {submitState.error && (
                <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg">
                  {submitState.error}
                </p>
              )}

              {!wallet.connected && (
                <p className="text-sm text-gray-500 text-center">
                  Connect your wallet to create offers
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Token Dialog */}
        {customTokenDialog && (
          <CustomTokenDialog
            customToken={customToken}
            isLoading={isLoading}
            setValidationState={setValidationState}
            validationState={validationState}
            handleImportCustomToken={handleImportCustomToken}
            handleTokenAddressChange={handleTokenAddressChange}
            setCustomToken={setCustomToken}
            setCustomTokenDialog={setCustomTokenDialog}
          />
        )}
      </div>
    </div>
  );
}
