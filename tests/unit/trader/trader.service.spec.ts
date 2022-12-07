import { Test, TestingModule } from '@nestjs/testing';
import * as _ from 'lodash';
import { TraderModule } from '../../../src/trader/trader.module';
import { TraderService } from '../../../src/trader/trader.service';
import { SignalDetectionResponse } from '../../../src/signal-reader/dtos/signal-detection-response.dto';
import { TradeSignalDto } from '../../../src/trader/dtos/trade-signal-dto';
import { TradeSetting } from '../../../src/chat/schemas/chat-setting.model';

describe('Trader Service', () => {
  let testingModule: TestingModule;
  let traderService: TraderService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports:[TraderModule],
    }).compile();
    traderService = testingModule.get<TraderService>(TraderService);
  });

  afterAll(async()=>{
    await testingModule.close();
  });

  describe('Transpile', () => {
    it('should limit stoploss levels',async()=>{
      const signal: SignalDetectionResponse = {
        currency: "KLAY/USDT",
        entries: [
            "0.14001"
        ],
        targets: [
            "0.1386",
            "0.1372",
            "0.1358",
            "0.1344",
            "0.133",
            "0.1316"
        ],
        stopLoss: "0.154",
        leverage: "Cross (20X)",
        isValid: true,
      };

      {
        const trade1: TradeSignalDto = traderService.transpileTradeSignal(signal,{
          maxTpLevel: 2,
        } as any);
        expect(trade1.targets.length).toEqual(2);
        expect(trade1.targets[0]).toEqual("0.1386");
        expect(trade1.targets[1]).toEqual("0.1372");
      }

      {
        const trade1: TradeSignalDto = traderService.transpileTradeSignal(signal, {
          maxTpLevel: 10,
        } as any);
        expect(trade1.targets.length).toEqual(6);
        expect(trade1.targets[0]).toEqual("0.1386");
        expect(trade1.targets[1]).toEqual("0.1372");
      }

      {
        const trade1: TradeSignalDto = traderService.transpileTradeSignal(signal, {
          maxTpLevel: 0,
        } as any);
        expect(trade1.targets.length).toEqual(6);
        expect(trade1.targets[0]).toEqual("0.1386");
        expect(trade1.targets[1]).toEqual("0.1372");
        expect(trade1.targets[2]).toEqual("0.1358");
        expect(trade1.targets[3]).toEqual("0.1344");
        expect(trade1.targets[4]).toEqual("0.133");
        expect(trade1.targets[5]).toEqual("0.1316");
      }
      
    });

    it('should detect SHORT and LONG trade type', async()=>{
      const signal: SignalDetectionResponse = {
        currency: "KLAY/USDT",
        entries: [
            "0.14001"
        ],
        targets: [
            "0.1386",
            "0.1372",
            "0.1358",
            "0.1344",
            "0.133",
            "0.1316"
        ],
        stopLoss: "0.154",
        leverage: "Cross (20X)",
        isValid: true,
      };

      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal(signal);
        expect(trade.type).toEqual('SHORT');
      }

      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal({...signal, entries:["0.1316","0.1316"]});
        expect(trade.type).toEqual('LONG');
      }
    });

    it('should calculate preferred stop-loss', async()=>{
      const signal: SignalDetectionResponse = {
        currency: "KLAY/USDT",
        entries: [
            "0.1000"
        ],
        targets: [
            "0.1386",
            "0.1372",
            "0.1358",
            "0.1344",
            "0.133",
            "0.1316"
        ],
        stopLoss: "0.154",
        leverage: "Cross (20X)",
        isValid: true,
      };

      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal(signal,{preferredStopLossPercentage:50} as any);
        expect(trade.stopLoss).toEqual('0.05');
      }

      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal(signal,{preferredStopLossPercentage:12.5} as any);
        expect(trade.stopLoss).toEqual('0.0875');
      }

      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal(
          { ...signal, targets: ['0.08'] },
          { preferredStopLossPercentage: 50 } as any);
        expect(trade.stopLoss).toEqual('0.15');
      }
    });

    it('should transpile settings', async()=>{
      const signal: SignalDetectionResponse = {
        currency: "KLAY/USDT",
        entries: [
            "0.14001"
        ],
        targets: [
            "0.1386",
            "0.1372",
            "0.1358",
            "0.1344",
            "0.133",
            "0.1316"
        ],
        stopLoss: "0.154",
        leverage: "Cross (20X)",
        isValid: true,
      };

      const setting: TradeSetting = {
        entryMoneyCurrency:100,
        entryMoneyPercentage: 20,
        isEnabled: true,
        maxTpLevel:2,
        movingStopLossLevel:3,
        preferredStopLossPercentage: 0,
        tpPercentages:[10,20,30,40],
      };
      {
        const trade: TradeSignalDto = traderService.transpileTradeSignal(signal, setting);     
        const expected: TradeSignalDto = {
          entryMoneyCurrency: 100,
          entryMoneyPercentage: 20,
          movingStopLossLevel: 3,
          tpPercentages: [10, 20, 30, 40],

          currency: "KLAY/USDT",
          entries: [
            "0.14001"
          ],
          targets: [
            "0.1386",
            "0.1372",
          ],
          stopLoss: "0.154",
          leverage: "Cross (20X)",
          type: 'SHORT',
        };

        expect(_.isMatch(trade,expected)).toBeTruthy();
      }
    })
  });
});
