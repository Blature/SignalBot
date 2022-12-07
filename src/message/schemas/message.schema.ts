import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SignalDetectionResponse } from '../../signal-reader/dtos/signal-detection-response.dto';
import { TradeSignalDto } from '../../trader/dtos/trade-signal-dto';

export const MessageSchemaName = 'messages';

@Schema({
  timestamps: true,
})
export class MessageModel {
  @Prop({
    required: true,
    type: String,
  })
  public _id: string;

  @Prop()
  public tgId: number;

  @Prop()
  public tgChatId: number;

  @Prop()
  public chatId: string;

  @Prop()
  public text: string;

  @Prop()
  public contentType: string;

  @Prop({
    type: [String],
  })
  public parsers: string[];

  @Prop({
    type: SignalDetectionResponse,
  })
  public parsed: Record<string, any>;

  @Prop({ type: TradeSignalDto })
  public trade: Record<string, any>;

  @Prop()
  public tradeException?: string;


  
  //requestUrl
  //requestBody
  //response:{code: .... }
}

export type MessageDocument = MessageModel & Document;
export const MessageSchema = SchemaFactory.createForClass(MessageModel);
