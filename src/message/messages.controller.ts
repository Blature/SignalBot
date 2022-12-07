import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('Messages')
export class MessagesController {}
