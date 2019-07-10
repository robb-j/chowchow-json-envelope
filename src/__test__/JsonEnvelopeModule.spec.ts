import { JsonEnvelopeModule, processError } from '../JsonEnvelopeModule'
import { ChowChow, ChowChowInternals } from '@robb_j/chowchow'
import supertest from 'supertest'

class FakeChow extends ChowChow {
  agent = supertest(this.expressApp)

  async startServer() {}
  async stopServer() {}
}

describe('#processError', () => {
  it('should process iterators', () => {
    const message = processError(['A', 'B', 'C'])
    expect(message).toEqual(['A', 'B', 'C'])
  })
  it('should process strings', () => {
    const message = processError('A')
    expect(message).toEqual(['A'])
  })
  it('should process an Error', () => {
    const message = processError(new Error('A'))
    expect(message).toEqual(['A'])
  })
})

describe('JsonEnvelopeModule', () => {
  let chow: FakeChow & ChowChowInternals
  let jsonEnvelope: JsonEnvelopeModule
  beforeEach(() => {
    jsonEnvelope = new JsonEnvelopeModule({
      handleErrors: true,
      name: 'my-fancy-api',
      version: 'v1'
    })
    chow = new FakeChow().use(jsonEnvelope) as any
    jsonEnvelope.app = chow
  })

  describe('#setupModule', () => {
    it('should apply the error handler', async () => {
      await jsonEnvelope.setupModule()
      expect(chow.errorHandlers).toHaveLength(1)
    })
  })

  describe('#extendEndpointContext', () => {
    const baseCtx = { res: {} } as any
    it('should add a #sendData method', () => {
      const ctx = jsonEnvelope.extendEndpointContext(baseCtx)
      expect(ctx.sendData).toBeInstanceOf(Function)
    })
    it('should add a #sendFail method', () => {
      const ctx = jsonEnvelope.extendEndpointContext(baseCtx)
      expect(ctx.sendFail).toBeInstanceOf(Function)
    })
  })

  describe('#makeEnvelope', () => {
    let env: any
    beforeEach(() => {
      env = jsonEnvelope.makeEnvelope({ name: 'tim' }, true, ['Hey'], 418)
    })

    it('should have a meta packet', () => {
      expect(env.meta).toMatchObject({
        success: true,
        messages: ['Hey']
      })
    })
    it('should have a data payload', () => {
      expect(env.data).toMatchObject({
        name: 'tim'
      })
    })
    it('should have the name and version', () => {
      expect(env.meta).toMatchObject({
        name: 'my-fancy-api',
        version: 'v1'
      })
    })
  })

  describe('handleErrors', () => {
    beforeEach(async () => {
      chow.applyRoutes((app, r) => {
        app.get('/bad-route', ctx => {
          throw new Error('some_error')
        })
      })

      await chow.start()
    })
    afterEach(async () => {
      await chow.stop()
    })

    it('should return a http/400', async () => {
      let res = await chow.agent.get('/bad-route')
      expect(res.status).toEqual(400)
    })

    it('should send the error in the envelope', async () => {
      let res = await chow.agent.get('/bad-route')
      expect(res.body).toEqual({
        meta: expect.objectContaining({
          success: false,
          messages: ['some_error']
        }),
        data: null
      })
    })
  })
})
