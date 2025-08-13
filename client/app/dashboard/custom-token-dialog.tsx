import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const CustomTokenDialog = ({
  customToken,
  handleTokenAddressChange,
  validationState,
  setCustomToken,
  setValidationState,
  handleImportCustomToken,
  isLoading,
  setCustomTokenDialog,
}: {
  customToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: string;
    logo: string;
  };
  handleTokenAddressChange: any;
  validationState: any;
  setCustomToken: Dispatch<
    SetStateAction<{
      address: string;
      symbol: string;
      name: string;
      decimals: string;
      logo: string;
    }>
  >;
  setValidationState: any;
  handleImportCustomToken: any;
  isLoading: any;
  setCustomTokenDialog: any;
}) => {
  return (
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
            <label className="block text-sm font-medium mb-1">Symbol *</label>
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
              <label className="block text-sm font-medium mb-1">Decimals</label>
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
                maxLength={2}
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
                Only import tokens you trust. Malicious tokens can result in
                loss of funds. We validate that the token exists on devnet, but
                cannot guarantee safety.
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
  );
};

export default CustomTokenDialog;
