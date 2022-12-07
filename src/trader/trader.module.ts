import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TraderService } from './trader.service';

@Module({
  imports: [HttpModule],
  providers: [TraderService],
  exports: [TraderService],
})
export class TraderModule { }
