import { Injectable } from '@nestjs/common';
import { Airgram } from 'airgram';
import * as fs from 'fs';
import * as path from 'path';
import { environment } from '../../common/environments';

@Injectable()
export class AirgramClientProvider {
  public async createClient(clientId: string): Promise<Airgram> {
    return new Airgram({
      apiHash: environment.telegramAppHash,
      apiId: parseInt(environment.telegramAppId, 10),
      command: '../../dist/lib/tdjson.dll',
      databaseDirectory: this.getBotDirectory(clientId),
      logVerbosityLevel: 2,
      useTestDc: false,
    });
  }

  public async disposeClient(
    client: Airgram,
    removeClilentIdFolder: string = null,
  ): Promise<void> {
    if (client) {
      await client?.destroy();
    }

    if (removeClilentIdFolder) {
      const botDir: string = this.getBotDirectory(removeClilentIdFolder);
      fs.rmdir(
        botDir,
        {
          recursive: true,
        },
        (err: any) => {
          if (err) {
            // this.logger.warn({
            //   botDir,
            //   error: `Unable to delete bot directory`,
            //   message: err.message,
            // });
          }
        },
      );
    }
  }

  private getBotDirectory(botId: string): string {
    return path.resolve(environment.airgramDbPath || './airgram-db', botId);
  }
}
