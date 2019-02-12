import { JsonEnvelopeModule, processError } from '../JsonEnvelopeModule'
import { ChowChow, ChowChowInternals } from '@robb_j/chowchow'

class FakeChow extends ChowChow {
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
    chow = FakeChow.create().use(jsonEnvelope) as any
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
})
