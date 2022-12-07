import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../common/dtos/base-query.dto';
import { SendCodeDto } from './dtos/send-code.dto';
import { SetCodeDto } from './dtos/set-code.dto';
import { AirgramService } from './services/airgram.service';
import { ClientService } from './services/client.service';

@Controller('airgram')
@ApiTags('Airgram')
export class AirgramController {
  constructor(
    private readonly clientService: ClientService,
    private readonly airgramService: AirgramService,
  ) { }

  @Get()
  public async getAll(
    @Query()
    query: BaseQueryDto,
  ): Promise<any> {
    return this.clientService.getAll(query);
  }

  @Post('send-phone-verification-code')
  public async sendPhoneVerificationCode(
    @Body()
    dto: SendCodeDto,
  ): Promise<any> {
    dto.phoneNumber = this.normalizePhoneNumber(dto.phoneNumber);

    return this.airgramService.sendPhoneVerificationCode(dto.phoneNumber);
  }

  @Post('set-phone-verification-code')
  public async setPhoneVerificationCode(
    @Body()
    dto: SetCodeDto,
  ): Promise<any> {
    dto.phoneNumber = this.normalizePhoneNumber(dto.phoneNumber);

    return this.airgramService.setPhoneVerificationCode(dto.phoneNumber, dto.code);
  }

  @Delete('by-phone-number/:phoneNumber')
  public async deleteByPhoneNumber(
    @Param('phoneNumber')
    phoneNumber: string,
  ): Promise<any> {
    phoneNumber = this.normalizePhoneNumber(phoneNumber);

    return this.airgramService.deleteByPhoneNumber(phoneNumber);
  }

  @Delete(':id')
  public async delete(
    @Param('id')
    id: string,
  ): Promise<any> {
    return this.airgramService.deleteById(id);
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.trim().replace(/\+/g, '');
  }
}
