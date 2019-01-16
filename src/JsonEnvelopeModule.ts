import { Module, ChowChow, BaseContext } from '@robb_j/chowchow'
import { Api, IApiOptions } from 'api-formatter'

type JsonEnvelopeConfig = IApiOptions

export type JsonEnvelopeContext = {
  sendData: (data: any) => void
  sendFail: (messages: string[], status?: number) => void
}

export function makeEnvelope(
  data: any,
  success: boolean,
  messages: string[],
  status: number,
  name: string,
  version: string
) {
  return {
    meta: { success, messages, status, name, version },
    data
  }
}

export class JsonEnvelopeModule implements Module {
  app: ChowChow = null as any

  constructor(public config: JsonEnvelopeConfig = {}) {}

  checkEnvironment() {}
  setupModule() {}
  clearModule() {}
  extendExpress() {}

  extendEndpointContext(ctx: BaseContext): JsonEnvelopeContext {
    let api = new Api(ctx.req, ctx.res, this.config)
    return {
      sendData: (data: any) => api.sendData(data),
      sendFail: (msgs: string[], status = 400) => api.sendFail(msgs, status)
    }
  }
}
