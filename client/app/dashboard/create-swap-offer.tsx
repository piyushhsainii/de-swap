"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
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

// Mock validation function
const validateTokenOnChain = async (address) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (address.length < 40) {
    throw new Error("Invalid token address");
  }
  return {
    symbol: "TEST",
    name: "Test Token",
    decimals: 9,
    logo: "🪙",
  };
};

export default function SwapDashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState(defaultTokens);
  const [customTokenDialog, setCustomTokenDialog] = useState(false);

  // Custom token form state
  const [customToken, setCustomToken] = useState({
    address: "",
    symbol: "",
    name: "",
    decimals: "",
    logo: "",
  });

  // Validation state
  const [validationState, setValidationState] = useState({
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

  const [submitState, setSubmitState] = useState({
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
  const validateToken = async (address) => {
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
        error: err.message || "Failed to validate token",
        tokenInfo: null,
      });
    }
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleTokenAddressChange = (address) => {
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
        error: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (
      !isWalletConnected ||
      !offerFrom ||
      !offerTo ||
      !offerAmount ||
      !offerPrice
    ) {
      return;
    }

    setSubmitState({ isSubmitting: true, success: false, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitState({ isSubmitting: false, success: true, error: null });

      // Reset form after success
      setTimeout(() => {
        setOfferFrom("");
        setOfferTo("");
        setOfferAmount("");
        setOfferPrice("");
        setSubmitState({ isSubmitting: false, success: false, error: null });
      }, 2000);
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        success: false,
        error: "Failed to create offer. Please try again.",
      });
    }
  };

  const handleTakeOffer = async (offerId) => {
    if (!isWalletConnected) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Token Swap Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage your token swap offers
          </p>
        </div>

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
                  disabled={!isWalletConnected}
                  className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50"
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
                  placeholder="Price per token"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  disabled={!isWalletConnected}
                  className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmitOffer}
                disabled={
                  !isWalletConnected ||
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

              {!isWalletConnected && (
                <p className="text-sm text-gray-500 text-center">
                  Connect your wallet to create offers
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Token Dialog */}
        {customTokenDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Import Custom Token</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Add a custom Solana token to your swap options
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Token Address *
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Enter token mint address..."
                      value={customToken.address}
                      onChange={(e) => handleTokenAddressChange(e.target.value)}
                      className="w-full font-mono text-sm pr-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validationState.isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      )}
                      {validationState.isValid === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {validationState.isValid === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {validationState.error && (
                    <p className="text-sm text-red-600 mt-1 bg-red-50 p-2 rounded-lg">
                      {validationState.error}
                    </p>
                  )}
                  {validationState.isValid === true && (
                    <p className="text-sm text-green-600 mt-1 bg-green-50 p-2 rounded-lg">
                      ✓ Token found on devnet
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Symbol *
                  </label>
                  <input
                    placeholder="e.g., BONK"
                    value={customToken.symbol}
                    onChange={(e) =>
                      setCustomToken((prev) => ({
                        ...prev,
                        symbol: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    placeholder="e.g., Bonk Token"
                    value={customToken.name}
                    onChange={(e) =>
                      setCustomToken((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Decimals
                    </label>
                    <input
                      type="number"
                      placeholder="9"
                      min="0"
                      max="18"
                      value={customToken.decimals}
                      onChange={(e) =>
                        setCustomToken((prev) => ({
                          ...prev,
                          decimals: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Logo Emoji
                    </label>
                    <input
                      placeholder="🪙"
                      maxLength="2"
                      value={customToken.logo}
                      onChange={(e) =>
                        setCustomToken((prev) => ({
                          ...prev,
                          logo: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Security Notice:</p>
                    <p>
                      Only import tokens you trust. Malicious tokens can result
                      in loss of funds. We validate that the token exists on
                      devnet, but cannot guarantee safety.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setCustomTokenDialog(false);
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
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCustomToken}
                  disabled={
                    !customToken.address ||
                    !customToken.symbol ||
                    validationState.isValid !== true ||
                    isLoading
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </span>
                  ) : (
                    "Import Token"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
