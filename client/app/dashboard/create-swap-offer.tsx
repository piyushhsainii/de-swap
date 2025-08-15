"use client";

import { useState } from "react";
import { Plus, CheckCircle, Loader2, ArrowUpDown } from "lucide-react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import CustomTokenDialog from "./custom-token-dialog";
import { AnchorProvider, BN, getProvider, Program } from "@coral-xyz/anchor";
import IDL from "../../../programs/swap-program/src/IDL/swap_program.json";
import { SwapProgram } from "../../../programs/swap-program/src/IDL/swap_program";
import { toast } from "sonner";
// Mock data for demonstration
const MainNetTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    address: new PublicKey("So11111111111111111111111111111111111111112"),
    decimals: 9,
    logo: "🟣",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    decimals: 6,
    logo: "🔵",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    address: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
    decimals: 6,
    logo: "⚡",
  },
];

const defaultTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    address: new PublicKey("So11111111111111111111111111111111111111112"), // same on all clusters
    decimals: 9,
    logo: "🟣",
  },
  {
    symbol: "USDC",
    name: "USD Coin (Devnet)",
    address: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // devnet USDC
    decimals: 6,
    logo: "🔵",
  },
  {
    symbol: "RAY",
    name: "Raydium (Devnet)",
    address: new PublicKey("Cm8pCfXg7tVb2xzVj63Bx2tP4Z4HcUXkM9ZAcb6D3r2S"), // devnet Raydium test mint
    decimals: 6,
    logo: "⚡",
  },
];

export default function SwapDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<
    {
      symbol: string;
      name: string;
      address: PublicKey;
      decimals: number;
      logo: string;
    }[]
  >(defaultTokens);
  const [customTokenDialog, setCustomTokenDialog] = useState(false);
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

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
  const [offerFromATA, setFromofferATA] = useState<PublicKey | null>(null);
  const [offerToATA, setofferToATA] = useState<PublicKey | null>(null);

  const [submitState, setSubmitState] = useState<{
    isSubmitting: boolean;
    success: boolean;
    error: any;
  }>({
    isSubmitting: false,
    success: false,
    error: null,
  });

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
        address: new PublicKey(customToken.address),
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
    if (
      !offerFrom ||
      !offerTo ||
      !offerAmount ||
      !offerPrice ||
      !wallet.publicKey
    ) {
      return;
    }
    setSubmitState({ isSubmitting: true, success: false, error: null });
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      console.log(connection);

      if (!anchorWallet) return;
      const programId = new PublicKey(IDL.metadata.address);
      const provider = new AnchorProvider(connection, anchorWallet, {
        commitment: "confirmed",
      });
      if (!offerFromATA) {
        toast("Invalid offer address");
        return;
      }
      const program = new Program<SwapProgram>(IDL, programId, provider);
      if (!offerToATA) return toast("Invalid wanted token address");

      function randomU64() {
        const buf = new Uint8Array(8);
        window.crypto.getRandomValues(buf);
        const hex = Array.from(buf)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        return new BN(hex, 16);
      }
      const id = randomU64();
      const amountBN = new BN(parseInt(offerAmount));
      const priceBN = new BN(parseInt(offerPrice));
      const tokenAMint = defaultTokens.find((data) => offerFrom == data.symbol);
      const tokenBMint = defaultTokens.find((data) => offerTo == data.symbol);
      if (!tokenAMint || !tokenBMint) return {};
      // offer
      const offer = PublicKey.findProgramAddressSync(
        [
          Buffer.from("offer"),
          Buffer.from(wallet.publicKey.toBytes()),
          id.toArrayLike(Buffer, "le", 8),
        ],
        programId
      );
      // deriving vault address
      const vault = await getAssociatedTokenAddress(
        tokenAMint?.address,
        offer[0],
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log(offerFromATA.toString());
      // creating an instruction
      const instruction = await program.methods
        .makeOffer(id, amountBN, priceBN)
        .accounts({
          tokenA: tokenAMint?.address,
          tokenB: tokenBMint?.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          maker: wallet.publicKey,
          makerAccountTokenA: offerFromATA,
          offer: offer[0],
          vault: vault,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();
      const latestBlockHash = await connection.getLatestBlockhash();
      // creating an transaction
      const tx = new Transaction({
        feePayer: wallet.publicKey,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      }).add(instruction);
      // send the tx to blockchain
      const signedTx = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
      });

      await connection.confirmTransaction({
        signature: sig,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      });
      setSubmitState({
        isSubmitting: false,
        success: true,
        error: null,
      });
    } catch (error) {
      console.log(error);
      setSubmitState({
        isSubmitting: false,
        success: false,
        error: "Failed to create offer. Please try again.",
      });
      toast("Error occured");
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
    const tempOffertOATA = offerToATA;
    const tempOfferFromATA = offerFromATA;
    setofferToATA(tempOfferFromATA);
    setFromofferATA(tempOffertOATA);
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
                      onChange={async (e) => {
                        setOfferFrom(e.target.value);
                        const selectedToken = tokens.find(
                          (data) => e.target.value == data.symbol
                        );
                        if (!selectedToken) return toast("Invalid offer token");
                        if (!wallet.publicKey)
                          return toast("Wallet not connected!");
                        let tokenA;
                        tokenA = await getAssociatedTokenAddress(
                          selectedToken.address,
                          wallet.publicKey,
                          false,
                          TOKEN_PROGRAM_ID
                        );
                        setFromofferATA(tokenA);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 p-3"
                    >
                      <option value="">Select token to offer</option>
                      {tokens.map((token) => (
                        <option
                          key={token.address.toString()}
                          value={token.symbol}
                        >
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
                {/* <div>
                  <label
                    htmlFor=""
                    className="flex gap-1 items-center text-purple-700 text-sm font-semibold"
                  >
                    {" "}
                    <Wallet size={15} color="purple" /> Offer ATA{" "}
                  </label>
                  <input
                    value={}
                    type="text"
                    placeholder="Associated Token Address"
                    className="w-full rounded-xl border border-purple-700 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50 placeholder:text-sm text-xs"
                  />
                </div> */}
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
                      onChange={async (e) => {
                        setOfferTo(e.target.value);
                        const selectedToken = tokens.find(
                          (data) => e.target.value == data.symbol
                        );
                        if (!selectedToken) return toast("Invalid offer token");
                        if (!wallet.publicKey)
                          return toast("Wallet not connected!");
                        let tokenB;
                        tokenB = await getAssociatedTokenAddress(
                          selectedToken.address,
                          wallet.publicKey,
                          false,
                          TOKEN_PROGRAM_ID
                        );
                        setofferToATA(tokenB);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 p-3"
                    >
                      <option value="">Select token you want</option>
                      {tokens.map((token) => (
                        <option
                          key={token.address.toString()}
                          value={token.symbol}
                        >
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
                  className="w-full rounded-xl border border-purple-700 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50"
                />
                {/* <div>
                  <label
                    htmlFor=""
                    className="flex gap-1 items-center text-purple-700 text-sm font-semibold"
                  >
                    <Wallet size={15} color="purple" /> Tokens wanted ATA{" "}
                  </label>
                  <input
                    value={offerToATA?.toString() ?? ""}
                    type="text"
                    readOnly
                    placeholder="Associated Token Address"
                    className="w-full rounded-xl border border-purple-700 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 p-3 disabled:opacity-50 placeholder:text-sm text-xs"
                  />
                </div> */}
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
