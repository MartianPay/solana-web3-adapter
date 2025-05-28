import {
  SignerWalletAdapter,
  WalletName,
  SendTransactionOptions,
  BaseSignerWalletAdapter,
  WalletReadyState,
  WalletError,
  TransactionOrVersionedTransaction,
} from "@solana/wallet-adapter-base";

import {
  Connection,
  Transaction,
  TransactionVersion,
  VersionedTransaction,
  TransactionSignature,
  PublicKey,
} from "@solana/web3.js";
import { FireblocksConnectionAdapter } from "./FireblocksConnectionAdapter";

export const FireblocksSolanaWalletName =
  "Fireblocks Solana Wallet" as WalletName<"Fireblocks Solana Wallet">;

export class FireblocksSolanaWalletAdapter
  extends BaseSignerWalletAdapter
  implements SignerWalletAdapter
{
  name = FireblocksSolanaWalletName;
  url = "https://github.com/fireblocks/solana-web3-adapter";
  icon = "";
  supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set([
    "legacy",
    0,
  ]);

  private connection: FireblocksConnectionAdapter;

  constructor(connection: FireblocksConnectionAdapter) {
    super();
    this.connection = connection;
  }

  get connecting() {
    return false;
  }

  get publicKey(): PublicKey | null {
    const address = this.connection.getAccount();
    if (!address || typeof address !== "string") {
      return null;
    }
    return new PublicKey(address);
  }

  get readyState() {
    return WalletReadyState.Loadable;
  }

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}

  async sendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    _connection: Connection | null,
    _options: SendTransactionOptions = {}
  ): Promise<TransactionSignature> {
    try {
      return await this.connection.sendTransaction(transaction);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send transaction";

      const walletError = new WalletError(message);
      this.emit("error", walletError);
      throw walletError;
    }
  }

  signTransaction<
    T extends TransactionOrVersionedTransaction<
      this["supportedTransactionVersions"]
    >,
  >(transaction: T): Promise<T> {
    //do nothing here, Fireblocks will handle the signing
    return Promise.resolve(transaction);
  }
}
