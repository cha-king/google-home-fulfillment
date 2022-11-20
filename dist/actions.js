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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_on_google_1 = require("actions-on-google");
const axios_1 = __importDefault(require("axios"));
const devices_1 = __importDefault(require("./devices"));
const LIGHT_CONTROLLER_URL = 'http://smart-lamp.home.cha-king.com/lightState';
const app = (0, actions_on_google_1.smarthome)();
app.onSync((body, headers) => {
    console.log("SYNC");
    return {
        requestId: body.requestId,
        payload: {
            agentUserId: "FAKE USER ID",
            devices: devices_1.default.map(device => device.metadata),
        }
    };
});
app.onQuery((body, headers) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("QUERY");
    // TODO: Actually reference devices here
    const id = body.inputs[0].payload.devices[0].id;
    if (id === '12345') {
        const response = yield axios_1.default.get(LIGHT_CONTROLLER_URL);
        return {
            requestId: body.requestId,
            payload: {
                devices: {
                    '12345': {
                        on: response.data,
                        online: true,
                        status: 'SUCCESS',
                    }
                }
            }
        };
    }
    return {
        requestId: body.requestId,
        payload: {
            devices: []
        }
    };
}));
app.onExecute((body, headers) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("EXECUTE");
    // TODO: Actually parse this sensibly
    const val = (_a = body.inputs[0].payload.commands[0].execution[0].params) === null || _a === void 0 ? void 0 : _a.on;
    if (val === true) {
        yield axios_1.default.post(LIGHT_CONTROLLER_URL, 'true');
    }
    else if (val === false) {
        yield axios_1.default.post(LIGHT_CONTROLLER_URL, 'false');
    }
    return {
        requestId: body.requestId,
        payload: {
            commands: [
                {
                    ids: ['12345'],
                    status: 'SUCCESS',
                    states: {
                        online: true,
                        on: val,
                    }
                }
            ]
        }
    };
}));
exports.default = app;
