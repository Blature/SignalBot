import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseQueryDto } from '../common/dtos/base-query.dto';
import { PaginatedResponse } from '../common/dtos/paginated-response.dto';
import { chatUpdateDto } from './dtos/chat-update.dto';
import { ChatDocument, ChatModel, ChatSchemaName } from './schemas/chat.schema';
import * as _ from 'lodash';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatSchemaName)
    private readonly chatModel: Model<ChatDocument>,
  ) {}

  public async getAll(query: BaseQueryDto): Promise<PaginatedResponse<ChatDocument>> {
    const filter = (await query.filter) || {};

    console.log(filter)
    const collection = await this.chatModel
      .find(filter)
      .sort(
        query.sort || {
          createdAt: -1,
        },
      )
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    const total: number = await this.chatModel.count(filter).exec();

    return {
      collection,
      total,
    };
  }

  public async getById(chatId: string): Promise<ChatDocument> {
    const chat: ChatDocument = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`chat with {_id: ${chatId}} not found`);
    }

    return chat;
  }

  public async update(chatId: string, dto: chatUpdateDto): Promise<ChatDocument> {
    const chat: ChatDocument = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`chat with {_id: ${chatId}} not found`);
    }

    dto.setting = _.merge(chat.setting, dto.setting);
    console.log('final setting:', dto.setting);

    return this.chatModel.findByIdAndUpdate(
      chatId,
      {
        $set: dto,
      },
      {
        new: true,
      },
    );
  }

  public async findOne(filter: FilterQuery<ChatDocument>): Promise<ChatDocument> {
    return this.chatModel.findOne(filter);
  }

  public async create(chat: ChatModel): Promise<ChatDocument> {
    return this.chatModel.create(chat);
  }
}
