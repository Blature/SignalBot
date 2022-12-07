import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseQueryDto } from '../common/dtos/base-query.dto';
import { PaginatedResponse } from '../common/dtos/paginated-response.dto';
import { ChatsService } from './chats.service';
import { chatUpdateDto } from './dtos/chat-update.dto';
import { ChatDocument } from './schemas/chat.schema';

@Controller('chats')
@ApiTags('Chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Get()
  public async getAll(
    @Query()
    query: BaseQueryDto,
  ): Promise<PaginatedResponse<ChatDocument>> {
    return this.chatService.getAll(query);
  }

  @Get(':id')
  public async getById(
    @Param('id')
    id: string,
  ): Promise<ChatDocument> {
    return this.chatService.getById(id);
  }

  @Patch(':id')
  public async update(
    @Param('id')
    id: string,
    @Body()
    dto: chatUpdateDto,
  ): Promise<ChatDocument> {
    return this.chatService.update(id, dto);
  }
}
