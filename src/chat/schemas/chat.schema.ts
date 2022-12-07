import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ChatSettingModel } from './chat-setting.model';

export const ChatSchemaName = 'chats';

@Schema({
  timestamps: true,
})
export class ChatModel {
  @Prop({
    default: uuid,
    required: true,
    type: String,
  })
  public _id: string;

  @Prop()
  title: string;

  @Prop({
    type: Number,
  })
  public tgUserId: number;

  @Prop({
    type: Number,
  })
  public tgChatId: number;

  @Prop({
    type: ChatSettingModel,
  })
  public setting?: ChatSettingModel;
}

export type ChatDocument = ChatModel & Document;
export const ChatSchema = SchemaFactory.createForClass(ChatModel);
