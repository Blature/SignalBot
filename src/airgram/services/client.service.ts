import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryDto } from '../../common/dtos/base-query.dto';
import { PaginatedResponse } from '../../common/dtos/paginated-response.dto';
import { ClientInfoDocument, clientInfoSchemaName } from '../schemas/client-info.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(clientInfoSchemaName)
    private readonly clientModel: Model<ClientInfoDocument>,
  ) {}

  // manage airgram clients
  // manage database

  public async getAll(query: BaseQueryDto): Promise<PaginatedResponse<ClientInfoDocument>> {
    const filter = (await query.filter) || {};
    const collection = await this.clientModel
      .find(filter)
      .sort(
        query.sort || {
          createdAt: -1,
        },
      )
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    const total: number = await this.clientModel.count(filter).exec();

    return {
      collection,
      total,
    };
  }
}
