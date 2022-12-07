import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { AirgramController } from './airgram.controller';
import { AirgramUpdateListener } from './listener/airgram-update.lisener';
import {
  ClientInfoSchema,
  clientInfoSchemaName,
} from './schemas/client-info.schema';
import { AirgramClientProvider } from './services/airgram-client.provider';
import { AirgramService } from './services/airgram.service';
import { ClientService } from './services/client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: clientInfoSchemaName, schema: ClientInfoSchema },
    ]),
    MessageModule,
    ChatModule,
  ],
  controllers: [AirgramController],
  providers: [
    ClientService,
    AirgramClientProvider,
    AirgramService,
    AirgramUpdateListener,
  ],
})
export class AirgramModule {}
