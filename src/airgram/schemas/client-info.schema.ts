import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const clientInfoSchemaName = 'client-info';

@Schema({
  timestamps: true,
})
export class ClientInfoModel {
  @Prop({
    default: uuid,
    required: true,
    type: String,
  })
  public _id: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    type: Number,
  })
  public tgUserId: number;

  @Prop()
  public tgUserName: string;

  @Prop()
  public tgPhoneNumber: string;

  @Prop()
  public code: string;

  @Prop()
  public authLink?: string;

  @Prop()
  public authorizationState?: string;

  @Prop(raw({}))
  public authorizationStateDetail?: Record<string, any>;

  @Prop({
    required: true,
    default: false,
  })
  public isDisabled: boolean;
}

export type ClientInfoDocument = ClientInfoModel & Document;
export const ClientInfoSchema = SchemaFactory.createForClass(ClientInfoModel);
