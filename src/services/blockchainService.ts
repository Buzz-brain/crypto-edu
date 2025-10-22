import { Transaction, CryptoCurrency } from '../types';
import { SUPPORTED_CURRENCIES } from '../config/constants';

interface SimulationConfig {
  confirmationSpeed: 'fast' | 'normal' | 'slow';
  gasMultiplier: number;
  volatilityEnabled: boolean;
  failureRate: number;
}

class BlockchainService {
  private config: SimulationConfig = {
    confirmationSpeed: 'normal',
    gasMultiplier: 1,
    volatilityEnabled: true,
    failureRate: 0.05
  };

  private getConfirmationDelay(): number {
    const baseDelay = {
      fast: 2000,
      normal: 5000,
      slow: 10000
    };
    return baseDelay[this.config.confirmationSpeed];
  }

  async estimateGas(currency: string, amount: number): Promise<number> {
    // SRS 3.2.1: Gas estimation for transparency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseCurrency = SUPPORTED_CURRENCIES.find(c => c.symbol === currency);
    if (!baseCurrency) throw new Error('Unsupported currency');
    
    return Math.round(baseCurrency.gasPrice * this.config.gasMultiplier);
  }

  async initiatePayment(
    amount: number, 
    currency: CryptoCurrency, 
    recipient: string
  ): Promise<string> {
    // SRS 3.1.1: Payment initiation
    const txHash = this.generateTxHash();
    
    // Simulate MetaMask confirmation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() < this.config.failureRate) {
      throw new Error('Transaction failed: Insufficient gas or network congestion');
    }
    
    return txHash;
  }

  async confirmTransaction(txHash: string): Promise<Transaction> {
    // SRS 3.1.2: Transaction confirmation flow
    const delay = this.getConfirmationDelay();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `tx_${Date.now()}`,
          studentId: 'STU2024001',
          studentName: 'Alice Smith',
          amount: 2.5,
          currency: SUPPORTED_CURRENCIES[1],
          usdValue: 6000,
          txHash,
          status: 'confirmed',
          type: 'tuition',
          description: 'Payment Confirmed',
          gasUsed: 21000,
          gasPrice: 25,
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          confirmations: 6,
          requiredConfirmations: 6,
          createdAt: new Date().toISOString(),
          confirmedAt: new Date().toISOString()
        });
      }, delay);
    });
  }

  simulateConfirmationProgress(
    txHash: string, 
    onProgress: (confirmations: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      let confirmations = 0;
      const requiredConfirmations = 6;
      
      const interval = setInterval(() => {
        confirmations++;
        onProgress(confirmations);
        
        if (confirmations >= requiredConfirmations) {
          clearInterval(interval);
          resolve();
        }
      }, this.getConfirmationDelay() / 6);
    });
  }

  private generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  updateSimulationConfig(config: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getSimulationConfig(): SimulationConfig {
    return { ...this.config };
  }
}

export const blockchainService = new BlockchainService();