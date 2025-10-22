import { WalletConnection } from '../types';

class WalletService {
  private connected = false;
  private currentAccount: string | null = null;

  async connectMetaMask(): Promise<WalletConnection> {
    // SRS 3.4.1: Wallet connection simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() < 0.1) {
      throw new Error('MetaMask not installed or user rejected connection');
    }
    
    const mockAddress = '0x742d35Cc6643C0532925a3b8F26c6Cad1234567';
    const mockBalance = Math.random() * 10 + 1; // 1-11 ETH
    
    this.connected = true;
    this.currentAccount = mockAddress;
    
    return {
      address: mockAddress,
      balance: mockBalance,
      network: 'Ethereum Mainnet',
      connected: true
    };
  }

  async signTransaction(txData: any): Promise<string> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }
    
    // Simulate user confirmation dialog
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() < 0.05) {
      throw new Error('User rejected transaction');
    }
    
    return this.generateSignature();
  }

  async switchNetwork(chainId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (Math.random() < 0.1) {
      throw new Error('Network switch failed');
    }
  }

  disconnect(): void {
    this.connected = false;
    this.currentAccount = null;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getCurrentAccount(): string | null {
    return this.currentAccount;
  }

  private generateSignature(): string {
    const chars = '0123456789abcdef';
    let signature = '0x';
    for (let i = 0; i < 130; i++) {
      signature += chars[Math.floor(Math.random() * chars.length)];
    }
    return signature;
  }
}

export const walletService = new WalletService();