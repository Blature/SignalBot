"use strict";
exports.__esModule = true;
exports.environment = void 0;
var dotenv = require("dotenv");
dotenv.config();
var env = process.env;
exports.environment = {
    port: parseInt(env.PORT),
    mongoUrl: env.MONGO_URL,
    jwtSecret: env.JWT_SECRET,
    telegramAppId: env.TELEGRAM_APP_ID,
    telegramAppHash: env.TELEGRAM_APP_HASH,
    tdlibCommand: env.TDLIB_COMMAND,
    airgramDbPath: env.AIRGRAM_DB_PATH,
    paratradeServerUrl: env.PARATRADE_SERVER_URL
};
console.log('env', exports.environment);
