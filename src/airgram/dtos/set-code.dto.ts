import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetCodeDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  public phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  public code: string;
}
