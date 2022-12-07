import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './common/environments';
import { AuthModule } from './auth/auth.module';
import { SignalReaderModule } from './signal-reader/signal-reader.module';
import { AirgramModule } from './airgram/airgram.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TraderModule } from './trader/trader.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(environment.mongoUrl),
    AuthModule,
    SignalReaderModule,
    AirgramModule,
    ChatModule,
    MessageModule,
    TraderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
