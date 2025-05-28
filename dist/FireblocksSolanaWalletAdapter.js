"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireblocksSolanaWalletAdapter = exports.FireblocksSolanaWalletName = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
exports.FireblocksSolanaWalletName = "Fireblocks Solana Wallet";
class FireblocksSolanaWalletAdapter extends wallet_adapter_base_1.BaseSignerWalletAdapter {
    constructor(connection) {
        super();
        this.name = exports.FireblocksSolanaWalletName;
        this.url = "https://github.com/fireblocks/solana-web3-adapter";
        this.icon = "";
        this.supportedTransactionVersions = new Set([
            "legacy",
            0,
        ]);
        this.connection = connection;
    }
    get connecting() {
        return false;
    }
    get publicKey() {
        const address = this.connection.getAccount();
        if (!address || typeof address !== "string") {
            return null;
        }
        return new web3_js_1.PublicKey(address);
    }
    get readyState() {
        return wallet_adapter_base_1.WalletReadyState.Loadable;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    sendTransaction(transaction_1, _connection_1) {
        return __awaiter(this, arguments, void 0, function* (transaction, _connection, _options = {}) {
            try {
                return yield this.connection.sendTransaction(transaction);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to send transaction";
                const walletError = new wallet_adapter_base_1.WalletError(message);
                this.emit("error", walletError);
                throw walletError;
            }
        });
    }
    signTransaction(transaction) {
        //do nothing here, Fireblocks will handle the signing
        return Promise.resolve(transaction);
    }
}
exports.FireblocksSolanaWalletAdapter = FireblocksSolanaWalletAdapter;
