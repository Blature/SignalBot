import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignalReaderService } from './signal-reader.service';
import * as rawbody from 'raw-body';

@Controller('signal-reader')
@ApiTags('Signal Reader')
export class SignalReaderController {
  constructor(private readonly signalReaderService: SignalReaderService) {}

  @Post('test')
  public async test(
    @Req()
    req: any,
  ): Promise<any> {
    if (!req.readable) {
      throw new BadRequestException('invalid request format');
    }
    const raw = await rawbody(req);
    const text = raw.toString().trim();

    return this.signalReaderService.tryReadSignal(text);
  }
}
