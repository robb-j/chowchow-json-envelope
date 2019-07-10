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

export function processError(err: any): string[] {
  let messages: string[]

  if (err[Symbol.iterator]) messages = Array.from(err)
  else if (typeof err === 'string') messages = [err]
  else if (err instanceof Error) messages = [err.message]
  else messages = ['An unknown error occurred']

  return messages
}

export class JsonEnvelopeModule implements Module {
  app!: ChowChow
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
      this.app.applyErrorHandler((err, { res }) => {
        let payload = this.makeEnvelope(null, false, processError(err), 400)
        res.status(400).send(payload)
      })
    }
  }
  clearModule() {}
  extendExpress() {}

  extendEndpointContext({ res }: BaseContext): JsonEnvelopeContext {
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
