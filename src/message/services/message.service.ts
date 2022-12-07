import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageText } from 'airgram';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { ChatDocument } from '../../chat/schemas/chat.schema';
import { SignalDetectionResponse } from '../../signal-reader/dtos/signal-detection-response.dto';
import { SignalReaderService } from '../../signal-reader/signal-reader.service';
import { TradeSignalDto } from '../../trader/dtos/trade-signal-dto';
import { TraderService } from '../../trader/trader.service';
import { MessageDocument, MessageSchemaName } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageSchemaName)
    private readonly messageModel: Model<MessageDocument>,
    private readonly signalReader: SignalReaderService,
    private eventEmitter: EventEmitter2,
    private traderService: TraderService,
  ) {}

  public async onNewMessage(tgMessage: Message, chatDocument: ChatDocument): Promise<MessageDocument> {
    const text: string = this.extractTxtFromTgMessage(tgMessage);
    const setting = chatDocument.setting;
    if (!setting || !text) {
      return;
    }

    const isTradeEnable = setting.trade?.isEnabled;
    const isSaveMessageEnable = setting.saveMessage?.isEnabled;
    const isDetectSignalEnable = setting.detectSignal?.isEnabled || isTradeEnable;
    const forward = setting.forward?.isEnabled;

    let message: MessageDocument = null;
    let parsed: SignalDetectionResponse = null;
    let parsers: string[] = null;
    let trade: TradeSignalDto = null;

    if (isDetectSignalEnable) {
      parsers = setting.detectSignal.allowedParsers?.split(',').filter((p) => !!p) || [];
      parsed = this.signalReader.tryReadSignal(text, parsers);
    }

    let tradeException = parsed.isValid?null: `invalid signal`;
    if (isTradeEnable && parsed.isValid) {
      trade = this.traderService.transpileTradeSignal(parsed, setting.trade);
      await this.traderService.applyTrade(trade).catch(ex => {
        tradeException = ex?.message || ex;
        console.log({ tradeException });
      })
    }

    if (isSaveMessageEnable) {
      message = await this.messageModel.create({
        _id: uuid(),
        tgId: tgMessage.id,
        tgChatId: tgMessage.chatId,
        chatId: chatDocument._id,
        contentType: tgMessage.content._,
        text,
        parsed,
        trade,
        tradeException,
      });
    }

    return message;
  }

  private extractTxtFromTgMessage(tgMessage: Message): string {
    if (tgMessage?.content?._ !== 'messageText') {
      return null;
    }

    return (tgMessage.content as MessageText).text.text;
  }
}
