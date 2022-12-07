import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ChatSettingModel } from '../schemas/chat-setting.model';

export class chatUpdateDto {
  @ApiProperty()
  @IsOptional()
  public title?: string;

  @ApiProperty()
  @IsOptional()
  public setting: ChatSettingModel;
}
