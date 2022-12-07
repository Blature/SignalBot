import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Airgram, Auth, ErrorUnion, OkUnion, User } from 'airgram';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { AirgramUpdateListener } from '../listener/airgram-update.lisener';
import { ClientInfoDocument, clientInfoSchemaName } from '../schemas/client-info.schema';
import { AirgramClientProvider } from './airgram-client.provider';
import { ClientService } from './client.service';

@Injectable()
export class AirgramService {
  protected clients: Map<string, Airgram> = new Map();
  constructor(
    private readonly clientService: ClientService,
    private readonly airgramClientProvider: AirgramClientProvider,
    @InjectModel(clientInfoSchemaName)
    private readonly clientModel: Model<ClientInfoDocument>,
    private readonly airgramUpdateListener: AirgramUpdateListener,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.reloadAllClients();
  }

  public async reloadAllClients(): Promise<void> {
    for (const client of this.clients.values()) {
      await this.airgramClientProvider.disposeClient(client);
    }
    this.clients.clear();
    const clientInfoes: ClientInfoDocument[] = await this.clientModel.find({
      isDisabled: false,
    });
    for (const clientInfo of clientInfoes) {
      await this.getAndInitialAirgramClient(clientInfo);
    }
  }

  public async sendPhoneVerificationCode(phoneNumber: string): Promise<OkUnion | ErrorUnion> {
    let clientInfo: ClientInfoDocument = await this.clientModel.findOne({
      phoneNumber,
    });

    //todo: if client is already verified...

    if (!clientInfo) {
      clientInfo = await this.clientModel.create({
        _id: uuid(),
        phoneNumber,
      });
    }

    const airgramClient = await this.getAndInitialAirgramClient(clientInfo);

    return (
      await airgramClient.api.setAuthenticationPhoneNumber({
        phoneNumber,
      })
    ).response;
  }

  public async setPhoneVerificationCode(phoneNumber: string, code: string): Promise<any> {
    const clientInfo: ClientInfoDocument = await this.clientModel.findOne({
      phoneNumber,
    });

    if (!clientInfo) {
      throw new NotFoundException(`client with phone number: ${phoneNumber} not found`);
    }

    const airgramClient = await this.getAndInitialAirgramClient(clientInfo);

    airgramClient.use(
      new Auth({
        code,
        phoneNumber,
      }),
    );
    await airgramClient.api.setAuthenticationPhoneNumber({
      phoneNumber,
    });

    const me: User = (await airgramClient.api.getMe()).response as any;

    clientInfo.code = code;
    clientInfo.tgUserId = me.id;
    clientInfo.tgPhoneNumber = me.username;
    clientInfo.tgUserName = me.username;
    clientInfo.save();

    return me;
  }

  public async deleteByPhoneNumber(phoneNumber: string): Promise<any> {
    const client = await this.clientModel.findOne({
      phoneNumber,
    });

    return this.deleteById(client?._id);
  }

  public async deleteById(id: string): Promise<any> {
    const clientInfo: ClientInfoDocument = await this.clientModel.findOne({
      _id: id,
    });
    const airgramClient: Airgram = await this.airgramClientProvider.createClient(id);
    await this.airgramClientProvider.disposeClient(airgramClient, id);
    await clientInfo?.delete();
  }

  public async getAndInitialAirgramClient(clientInfo: ClientInfoDocument): Promise<Airgram> {
    const airgramClientId: string = clientInfo._id;
    if (this.clients.has(airgramClientId)) {
      return this.clients.get(airgramClientId);
    }

    const airgramClient: Airgram = await this.airgramClientProvider.createClient(airgramClientId);
    this.clients.set(airgramClientId, airgramClient);
    await this.initAirgramClient(airgramClient, clientInfo);

    airgramClient.use((ctx, next) => {
      if ('update' in ctx) {
        this.airgramUpdateListener.onUpdate(airgramClient, clientInfo, ctx.update);
      }

      return next();
    });

    return airgramClient;
  }

  private async initAirgramClient(airgramClient: Airgram, clientInfo: ClientInfoDocument): Promise<void> {
    // client.on(UPDATE.updateMessageContent, async ({ update }: { update: UpdateMessageContent}) => {
    //   await this.webHookMessageHandlerService.handleUpdateMessageContent(update, settings);
    // });
    // client.on(UPDATE.updateMessageSendSucceeded, async ({ update }: { update: UpdateMessageSendSucceeded}) => {
    //   await this.webHookMessageHandlerService.handleUpdateMessageSendSucceeded(update, settings);
    // });
    // client.on(UPDATE.updateDeleteMessages, async ({ update }: { update: UpdateDeleteMessages }) => {
    //   await this.webHookMessageHandlerService.handleDeleteMessageContent(update, settings);
    // });
    // client.on(UPDATE.updateNewMessage, async ({ update }: { update: UpdateNewMessage }) => {
    //   await this.webHookMessageHandlerService.handleUpdateNewMessage(update.message, settings, client);
    // });
    // client.on(UPDATE.updateChatAction, async ({ update }: { update: UpdateChatAction }) => {
    //   await this.webHookMessageHandlerService.handleUpdateChatAction(update, settings);
    // });
    // client.catch((err: any) => {
    //   if (!err) {
    //     return;
    //   }
    //   this.logger.error({
    //     botId: settings._id,
    //     error: `Airgram error`,
    //     message: err.message || err,
    //   });
    // });
    // await client.api.getChats({
    //   chatList: { '_': 'chatListMain' },
    //   limit: 100,
    // });
  }

  public async unInitClient(clientId: string): Promise<void> {
    if (!clientId) {
      return;
    }
    const client: Airgram = this.clients.get(clientId);
    this.clients.delete(clientId);
    await this.airgramClientProvider.disposeClient(client, clientId);
  }
}
