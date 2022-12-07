
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { TradeSetting } from "../chat/schemas/chat-setting.model";
import { SignalDetectionResponse } from "../signal-reader/dtos/signal-detection-response.dto";
import { TradeSignalDto } from "./dtos/trade-signal-dto";
import { catchError, firstValueFrom } from 'rxjs';
import { environment } from "../common/environments";


@Injectable()
export class TraderService {
  constructor(private readonly httpService: HttpService) {
  }

  public transpileTradeSignal(detectSignal: SignalDetectionResponse, setting: TradeSetting = null): TradeSignalDto {
    if (!detectSignal || !detectSignal.isValid) {
      return null;
    }
    setting = { ...setting };
    const trade: TradeSignalDto = {
      currency: detectSignal.currency,
      entries: detectSignal.entries,
      leverage: detectSignal.leverage,
      stopLoss: detectSignal.stopLoss,
      targets: detectSignal.targets.slice(0, setting.maxTpLevel || 9),
      tpPercentages: setting.tpPercentages,
      type: detectSignal.type,
      entryMoneyCurrency: setting.entryMoneyCurrency,
      entryMoneyPercentage: setting.entryMoneyPercentage,
      movingStopLossLevel: setting.movingStopLossLevel,
    };
    trade.type = detectSignal.entries[0] < detectSignal.targets[0] ? 'LONG' : 'SHORT';

    if (setting.preferredStopLossPercentage > 0) {
      const p1: number = 100 + ((trade.type === 'SHORT' ? +1 : -1) * setting.preferredStopLossPercentage);
      trade.stopLoss = ((Number(detectSignal.entries[0]) * p1) / 100).toString();
    }

    return trade;
  }

  public async applyTrade(trade: TradeSignalDto, preventDuplicate: boolean = true): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post<any>(environment.paratradeServerUrl, trade).pipe(
        catchError((error) => {throw error;}),
      ),
    );

    return data;
  }
}