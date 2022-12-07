import * as dotenv from 'dotenv';
import { EnvironmentDto } from '.';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: EnvironmentDto = {
  port: parseInt(env.PORT),
  mongoUrl: env.MONGO_URL,
  jwtSecret: env.JWT_SECRET,
  telegramAppId: env.TELEGRAM_APP_ID,
  telegramAppHash: env.TELEGRAM_APP_HASH,
  tdlibCommand: env.TDLIB_COMMAND,
  airgramDbPath: env.AIRGRAM_DB_PATH,
  paratradeServerUrl: env.PARATRADE_SERVER_URL,
};

console.log('env', environment);
