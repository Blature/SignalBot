import { Injectable } from '@nestjs/common';
import { Airgram, Chat, UpdateAuthorizationState, UpdateNewMessage } from 'airgram';
import { ClientInfoDocument } from '../schemas/client-info.schema';
import { UPDATE } from '@airgram/constants';
import { MessageService } from '../../message/services/message.service';
import { ChatsService } from '../../chat/chats.service';
import { ChatDocument, ChatModel } from '../../chat/schemas/chat.schema';
import { uuid } from 'uuidv4';

@Injectable()
export class AirgramUpdateListener {
  constructor(private readonly messageService: MessageService, private readonly chatService: ChatsService) {}

  public async onUpdate(airgramClient: Airgram, clientInfo: ClientInfoDocument, update: any): Promise<void> {
    switch (update._) {
      case UPDATE.updateAuthorizationState:
        return this.updateAuthorizationState(clientInfo, update);
      case UPDATE.updateNewMessage:
        return this.updateNewMessage(airgramClient, clientInfo, update);
    }

    console.log('update not defined:', update);
  }

  public async updateAuthorizationState(
    clientInfo: ClientInfoDocument,
    update: UpdateAuthorizationState,
  ): Promise<void> {
    clientInfo.authorizationState = update.authorizationState._;
    clientInfo.authorizationStateDetail = update.authorizationState;
    clientInfo.save();
  }

  public async updateNewMessage(
    airgramClient: Airgram,
    clientInfo: ClientInfoDocument,
    update: UpdateNewMessage,
  ): Promise<void> {
    const message = update.message;
    const tgChatId: number = message.chatId;
    let chat: ChatDocument = await this.chatService.findOne({
      tgChatId,
    });

    if (!chat) {
      // create chat if not exist
      const tgChatInfo: Chat = (await airgramClient.api.getChat({ chatId: tgChatId, })).response as any;
      const newChatModel: ChatModel = {
        _id: uuid(),
        tgChatId,
        tgUserId: clientInfo.tgUserId,
        title: 'Chat ' + tgChatId,
        setting: null,
      };
      if (tgChatInfo._ === 'chat') {
        newChatModel.title = tgChatInfo.title;
      }
      chat = await this.chatService.create(newChatModel);
    }

    await this.messageService.onNewMessage(update.message, chat);
  }
}
