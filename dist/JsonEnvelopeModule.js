"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_formatter_1 = require("api-formatter");
function makeEnvelope(data, success, messages, status, name, version) {
    return {
        meta: { success, messages, status, name, version },
        data
    };
}
exports.makeEnvelope = makeEnvelope;
class JsonEnvelopeModule {
    constructor(config = {}) {
        this.config = config;
        this.app = null;
    }
    checkEnvironment() { }
    setupModule() { }
    clearModule() { }
    extendExpress() { }
    extendEndpointContext(ctx) {
        let api = new api_formatter_1.Api(ctx.req, ctx.res, this.config);
        return {
            sendData: (data) => api.sendData(data),
            sendFail: (msgs, status = 400) => api.sendFail(msgs, status)
        };
    }
}
exports.JsonEnvelopeModule = JsonEnvelopeModule;
//# sourceMappingURL=JsonEnvelopeModule.js.map