import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalReaderModule } from '../signal-reader/signal-reader.module';
import { TraderModule } from '../trader/trader.module';
import { MessagesController } from './messages.controller';
import { MessageSchema, MessageSchemaName } from './schemas/message.schema';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MessageSchemaName,
        schema: MessageSchema,
      },
    ]),
    TraderModule,
    SignalReaderModule,
  ],
  controllers: [MessagesController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
