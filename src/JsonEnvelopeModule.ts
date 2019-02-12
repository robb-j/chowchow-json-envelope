import { Module, ChowChow, BaseContext } from '@robb_j/chowchow'

type JsonEnvelopeConfig = {
  name?: string
  version?: string
  handleErrors?: boolean
}

export type JsonEnvelopeContext = {
  sendData: (data: any) => void
  sendFail: (messages: string[], status?: number) => void
}

export class JsonEnvelopeModule implements Module {
  app: ChowChow = null as any
  publicName?: string
  publicVersion?: string

  constructor(public config: JsonEnvelopeConfig = {}) {
    this.publicName = config.name || process.env.npm_package_name
    this.publicVersion = config.version || process.env.npm_package_version
  }

  checkEnvironment() {}
  setupModule() {
    const { handleErrors = false } = this.config

    if (handleErrors) {
      this.app.applyErrorHandler((err, ctx) => {
        let messages: string[]

        if (err[Symbol.iterator]) messages = Array.from(err)
        else if (typeof err === 'string') messages = [err]
        else if (err instanceof Error) messages = [err.message]
        else messages = ['An unknown error occurred']

        ctx.res.send(this.makeEnvelope(null, false, messages, 400))
      })
    }
  }
  clearModule() {}
  extendExpress() {}

  extendEndpointContext({ res }: BaseContext): JsonEnvelopeContext {
    // let api = new Api(ctx.req, ctx.res, this.config)
    return {
      sendData: (data: any) => {
        res.send(this.makeEnvelope(data, true))
      },
      sendFail: (messages: string[], status = 400) => {
        res
          .status(status)
          .send(this.makeEnvelope(null, false, messages, status))
      }
    }
  }

  makeEnvelope(
    data: any,
    success: boolean = true,
    messages: string[] = [],
    status: number = 200
  ) {
    let envelope: any = {
      meta: { success, messages, status },
      data
    }

    if (this.publicName) envelope.meta.name = this.publicName
    if (this.publicVersion) envelope.meta.version = this.publicVersion

    return envelope
  }
}
