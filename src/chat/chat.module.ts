import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatSchema, ChatSchemaName } from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatSchemaName,
        schema: ChatSchema,
      },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatModule {}
