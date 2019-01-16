# Chow Chow | Json Envelope

Provides json response envelopes to [chowchow](https://github.com/robb-j/chowchow),
similar to [api-formatter](https://npmjs.org/package/api-formatter).

```ts
import { ChowChow, BaseContext } from '@robb_j/chowchow'
import {
  JsonEnvelopeModule,
  JsonEnvelopeConfig
} from '@robb_j/chowchow-json-envelope'

type Context = BaseContext & JsonEnvelopeConfig

// App entry point
;(async () => {
  let chow = ChowChow.create()

  // Add the module
  chow.use(
    new JsonEnvelopeModule({
      name: 'my-fancy-api',
      version: 'v1',
      handleErrors: true
    })
  )

  // Adds new methods to the context
  chow.applyRoutes((app, r) => {
    app.get('/', r(ctx => ctx.sendData('Hey!')))
    app.get('/err', r(ctx => ctx.sendFail(['Something broke']), 418))
  })

  // Run chow
  await chow.start()
})()
```

## Features

- Adds a `sendData` & `sendFail` method to the context to send formatted responses
- Defaults `name` & `version` in the envelope from `package.json` values
- Optionally handle express errors by passing `handleErrors`
  - Any errors thrown from routes will be formatted in the envelope

### Success Response, HTTP 200

```json
{
  "meta": {
    "success": true,
    "messages": [],
    "name": "my-fancy-api",
    "version": "v1"
  },
  "data": {
    "something": "cool!"
  }
}
```

### Failure Response, HTTP 400

```json
{
  "meta": {
    "success": false,
    "messages": ["Something went wrong :S"],
    "name": "my-fancy-api",
    "version": "v1"
  },
  "data": null
}
```

## Dev Commands

```bash
# Lint the source code
npm run lint

# Manually format code
# -> This repo runs prettier on git-stage, so committed code is always formatted
npm run prettier

# Run the unit tests
npm test

# Generate code coverage in coverage/
npm run coverage
```
