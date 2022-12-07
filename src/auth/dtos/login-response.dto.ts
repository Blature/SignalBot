import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  public token: string;

  @ApiProperty()
  public user: any;
}
