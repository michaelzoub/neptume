export interface ConnectedWallet {
    address: string;
    chainId: string; // E.g., "eip155:1" for Ethereum mainnet
    connectedAt: number; // Unix timestamp (in milliseconds)
    connectorType: string; // E.g., "injected"
    disconnect: () => void;
    fund: (amount: number) => Promise<void>;
    getEthereumProvider: () => Promise<any>; // Replace `any` with the appropriate Ethereum provider type if known
    getEthersProvider: () => Promise<any>; // Replace `any` with the appropriate Ethers.js provider type if known
    getWeb3jsProvider: () => Promise<any>; // Replace `any` with the appropriate Web3.js provider type if known
    imported: boolean;
    isConnected: () => Promise<boolean>;
    linked: boolean;
    loginOrLink: () => Promise<void>;
    meta: {
      name: string; // Wallet name, e.g., "Phantom"
      icon: string; // Base64-encoded icon string
      id: string; // Wallet identifier, e.g., "app.phantom"
    };
    sign: (data: any) => Promise<any>; // Replace `any` with the specific type of data being signed if known
    switchChain: (chainId: string) => Promise<void>; // Switch to a different blockchain network
    type: string; // Wallet type, e.g., "ethereum"
    unlink: () => Promise<void>;
    walletClientType: string; // E.g., "phantom"
  }