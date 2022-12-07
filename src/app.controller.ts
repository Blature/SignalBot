import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @Get()
  public async root(): Promise<any> {
    return {
      time: new Date(),
    };
  }
}
