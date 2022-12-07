import { Module } from '@nestjs/common';
import { SignalReaderController } from './signal-reader.controller';
import { SignalReaderService } from './signal-reader.service';

@Module({
  controllers: [SignalReaderController],
  providers: [SignalReaderService],
  exports: [SignalReaderService],
})
export class SignalReaderModule {}
