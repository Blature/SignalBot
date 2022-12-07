import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SaveMessageSetting {
  @ApiProperty()
  public isEnabled: boolean;
}

export class DetectSignalSetting {
  @ApiProperty()
  public isEnabled: boolean;

  @ApiProperty()
  public allowedParsers: string;
}

export class ForwardSetting {
  @ApiProperty()
  public isEnabled: boolean;

  @ApiProperty()
  public tgChatId?: number;

  @ApiProperty()
  public forwardOriginal: boolean;

  @ApiProperty()
  public forwardSignal: boolean;

  @ApiProperty()
  public forwardTrade: boolean;
}

export class TradeSetting {
  @ApiProperty()
  public isEnabled: boolean;

  @ApiProperty()
  public maxTpLevel: number;

  public tpPercentages: number []; 

  public movingStopLossLevel: number; // 0: off

  public entryMoneyPercentage: number;

  public entryMoneyCurrency: number;

  public preferredStopLossPercentage: number;
}

export class ChatSettingModel {
  @ApiProperty()
  @IsOptional()
  public saveMessage: SaveMessageSetting; // save in db

  @ApiProperty()
  @IsOptional()
  public detectSignal: DetectSignalSetting; // extract signal data from message

  @ApiProperty()
  public forward: ForwardSetting; // forward or resend data

  @ApiProperty()
  public trade: TradeSetting;
}
