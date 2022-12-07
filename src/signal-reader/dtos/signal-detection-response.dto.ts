export class SignalDetectionResponse {
  public parser?: string;
  public log?: string[];
  public currency: string;
  public type?: 'SHORT' | 'LONG' | undefined;
  public timeframe?: string;
  public strategyAccuracy?: number;
  public entries: string[];
  public targets: string[];
  public stopLoss: string;
  public leverage?: string;
  public info?: string;
  public isValid: boolean;
}
