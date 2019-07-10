"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processError(err) {
    let messages;
    if (err[Symbol.iterator])
        messages = Array.from(err);
    else if (typeof err === 'string')
        messages = [err];
    else if (err instanceof Error)
        messages = [err.message];
    else
        messages = ['An unknown error occurred'];
    return messages;
}
exports.processError = processError;
class JsonEnvelopeModule {
    constructor(config = {}) {
        this.config = config;
        this.publicName = config.name || process.env.npm_package_name;
        this.publicVersion = config.version || process.env.npm_package_version;
    }
    checkEnvironment() { }
    setupModule() {
        const { handleErrors = false } = this.config;
        if (handleErrors) {
            this.app.applyErrorHandler((err, { res }) => {
                let payload = this.makeEnvelope(null, false, processError(err), 400);
                res.status(400).send(payload);
            });
        }
    }
    clearModule() { }
    extendExpress() { }
    extendEndpointContext({ res }) {
        return {
            sendData: (data) => {
                res.send(this.makeEnvelope(data, true));
            },
            sendFail: (messages, status = 400) => {
                res
                    .status(status)
                    .send(this.makeEnvelope(null, false, messages, status));
            }
        };
    }
    makeEnvelope(data, success = true, messages = [], status = 200) {
        let envelope = {
            meta: { success, messages, status },
            data
        };
        if (this.publicName)
            envelope.meta.name = this.publicName;
        if (this.publicVersion)
            envelope.meta.version = this.publicVersion;
        return envelope;
    }
}
exports.JsonEnvelopeModule = JsonEnvelopeModule;
//# sourceMappingURL=JsonEnvelopeModule.js.map