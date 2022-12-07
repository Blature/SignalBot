export class TradeSignalDto{
  // Signal
  public currency: string;
  public type: 'SHORT' | 'LONG' | undefined;
  public entries: string[];
  public targets: string[];
  public stopLoss: string;
  public leverage: string;

  // Trade Options
  public tpPercentages: number []; 
  public movingStopLossLevel?: number; // 0: off
  public entryMoneyPercentage?: number;
  public entryMoneyCurrency?: number;
}