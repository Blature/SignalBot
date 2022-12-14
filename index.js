"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
var airgram_1 = require("airgram");
var debug_1 = require("debug");
var environment_1 = require("./common/environments/environment");
var writeLog = (0, debug_1["default"])('airgram:log');
var writeInfo = (0, debug_1["default"])('airgram:info');
var writeError = (0, debug_1["default"])('airgram:error');
var airgram = new airgram_1.Airgram({
    apiId: environment_1.environment.telegramAppId,
    apiHash: environment_1.environment.telegramAppHash,
    command: environment_1.environment.tdlibCommand,
    databaseDirectory: '../../db',
    logVerbosityLevel: 2
});
airgram.use(new airgram_1.Auth({
    code: function () { return (0, airgram_1.prompt)('Please enter the secret code:\n'); },
    phoneNumber: function () { return (0, airgram_1.prompt)('Please enter your phone number:\n'); }
}));
// async/await style of requests
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var me, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = airgram_1.toObject;
                return [4 /*yield*/, airgram.api.getMe()];
            case 1:
                me = _a.apply(void 0, [_b.sent()]);
                writeInfo('[Me] ', me);
                return [2 /*return*/];
        }
    });
}); })();
// Example above is equivalent to:
// airgram.api.getMe().then(toObject).then((me) => {
//   writeLog(`[Me] `, me)
// })
// handle errors
airgram.api
    .setProfilePhoto({
    photo: {
        _: 'inputFileLocal',
        path: '/invalid/path/to/image.jpg'
    }
})
    .then(function (_a) {
    var request = _a.request, response = _a.response;
    if ((0, airgram_1.isError)(response)) {
        writeError("[".concat(request.method, "][").concat(response.code, "] ").concat(response.message));
    }
    else {
        writeInfo('Profile photo has been loaded.');
    }
});
// Getting all updates
airgram.use(function (ctx, next) {
    if ('update' in ctx) {
        writeLog("[all updates][".concat(ctx._, "]"), JSON.stringify(ctx.update));
    }
    return next();
});
// Getting new messages
airgram.on('updateNewMessage', function (_a, next) {
    var update = _a.update;
    return __awaiter(void 0, void 0, void 0, function () {
        var message;
        return __generator(this, function (_b) {
            message = update.message;
            writeLog('[new message]', message);
            return [2 /*return*/, next()];
        });
    });
});
