import { JsonEnvelopeModule } from '../JsonEnvelopeModule'

describe('JsonEnvelopeModule', () => {
  let jsonEnvelope: JsonEnvelopeModule
  beforeEach(() => {
    jsonEnvelope = new JsonEnvelopeModule()
  })

  it('should exist', async () => {
    expect(jsonEnvelope).toBeDefined()
  })
})
