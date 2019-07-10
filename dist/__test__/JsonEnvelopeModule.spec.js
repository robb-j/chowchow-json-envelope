"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonEnvelopeModule_1 = require("../JsonEnvelopeModule");
const chowchow_1 = require("@robb_j/chowchow");
const supertest_1 = __importDefault(require("supertest"));
class FakeChow extends chowchow_1.ChowChow {
    constructor() {
        super(...arguments);
        this.agent = supertest_1.default(this.expressApp);
    }
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
        chow = new FakeChow().use(jsonEnvelope);
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
    describe('handleErrors', () => {
        beforeEach(async () => {
            chow.applyRoutes((app, r) => {
                app.get('/bad-route', ctx => {
                    throw new Error('some_error');
                });
            });
            await chow.start();
        });
        afterEach(async () => {
            await chow.stop();
        });
        it('should return a http/400', async () => {
            let res = await chow.agent.get('/bad-route');
            expect(res.status).toEqual(400);
        });
        it('should send the error in the envelope', async () => {
            let res = await chow.agent.get('/bad-route');
            expect(res.body).toEqual({
                meta: expect.objectContaining({
                    success: false,
                    messages: ['some_error']
                }),
                data: null
            });
        });
    });
});
//# sourceMappingURL=JsonEnvelopeModule.spec.js.map