"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonEnvelopeModule_1 = require("../JsonEnvelopeModule");
const chowchow_1 = require("@robb_j/chowchow");
class FakeChow extends chowchow_1.ChowChow {
    async startServer() { }
    async stopServer() { }
}
describe('#processError', () => {
    it('should process iterators', () => {
        const message = JsonEnvelopeModule_1.processError(['A', 'B', 'C']);
        expect(message).toEqual(['A', 'B', 'C']);
    });
    it('should process strings', () => {
        const message = JsonEnvelopeModule_1.processError('A');
        expect(message).toEqual(['A']);
    });
    it('should process an Error', () => {
        const message = JsonEnvelopeModule_1.processError(new Error('A'));
        expect(message).toEqual(['A']);
    });
});
describe('JsonEnvelopeModule', () => {
    let chow;
    let jsonEnvelope;
    beforeEach(() => {
        jsonEnvelope = new JsonEnvelopeModule_1.JsonEnvelopeModule({
            handleErrors: true,
            name: 'my-fancy-api',
            version: 'v1'
        });
        chow = FakeChow.create().use(jsonEnvelope);
        jsonEnvelope.app = chow;
    });
    describe('#setupModule', () => {
        it('should apply the error handler', async () => {
            await jsonEnvelope.setupModule();
            expect(chow.errorHandlers).toHaveLength(1);
        });
    });
    describe('#extendEndpointContext', () => {
        const baseCtx = { res: {} };
        it('should add a #sendData method', () => {
            const ctx = jsonEnvelope.extendEndpointContext(baseCtx);
            expect(ctx.sendData).toBeInstanceOf(Function);
        });
        it('should add a #sendFail method', () => {
            const ctx = jsonEnvelope.extendEndpointContext(baseCtx);
            expect(ctx.sendFail).toBeInstanceOf(Function);
        });
    });
    describe('#makeEnvelope', () => {
        let env;
        beforeEach(() => {
            env = jsonEnvelope.makeEnvelope({ name: 'tim' }, true, ['Hey'], 418);
        });
        it('should have a meta packet', () => {
            expect(env.meta).toMatchObject({
                success: true,
                messages: ['Hey']
            });
        });
        it('should have a data payload', () => {
            expect(env.data).toMatchObject({
                name: 'tim'
            });
        });
        it('should have the name and version', () => {
            expect(env.meta).toMatchObject({
                name: 'my-fancy-api',
                version: 'v1'
            });
        });
    });
});
//# sourceMappingURL=JsonEnvelopeModule.spec.js.map