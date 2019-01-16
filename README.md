# Chow Chow | Json Envelope

Provides json response envelope to [chowchow](https://github.com/robb-j/chowchow)
using [api-formatter](https://npmjs.org/package/api-formatter).

```ts
import { ChowChow, BaseContext } from '@robb_j/chowchow'
import {
  JsonEnvelopeModule,
  JsonEnvelopeConfig
} from '@robb_j/chowchow-json-envelope'

type Context = BaseContext & JsonEnvelopeConfig
;async () => {
  let chow = ChowChow.create()

  chow.use(new JsonEnvelopeModule({}))

  await chow.start()
}
```

## Features

> See [robb-j/api-formatter](https://github.com/robb-j/api-formatter) for usage,
> this module passes its config onto api-formatter's `Api`

- Adds `sendData` & `sendFail` method to the context for easy use
- Sets `name` & `version` in the envelope from `package.json` values

### Success Response, HTTP 200

```json
{
  "meta": {
    "success": true,
    "messages": [],
    "name": "My Fancy Api",
    "version": "0.1.2"
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
    "name": "My Fancy Api",
    "version": "0.1.2"
  },
  "data": null
}
```

## Dev Commands

```bash
# Run the app in dev mode
npm run dev:once

# Run in dev mode and restart on file changes
npm run dev:watch

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
