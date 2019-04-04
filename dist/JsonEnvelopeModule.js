"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonEnvelopeModule {
    constructor(config = {}) {
        this.config = config;
        this.app = null;
        this.publicName = config.name || process.env.npm_package_name;
        this.publicVersion = config.version || process.env.npm_package_version;
    }
    checkEnvironment() { }
    setupModule() {
        const { handleErrors = false } = this.config;
        if (handleErrors) {
            this.app.applyErrorHandler((err, ctx) => {
                let messages;
                if (err[Symbol.iterator])
                    messages = Array.from(err);
                else if (typeof err === 'string')
                    messages = [err];
                else if (err instanceof Error)
                    messages = [err.message];
                else
                    messages = ['An unknown error occurred'];
                ctx.res.send(this.makeEnvelope(null, false, messages, 400));
            });
        }
    }
    clearModule() { }
    extendExpress() { }
    extendEndpointContext({ res }) {
        // let api = new Api(ctx.req, ctx.res, this.config)
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