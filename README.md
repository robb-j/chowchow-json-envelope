# Chow Chow | Json Envelope

Provides json response envelopes to [chowchow](https://github.com/robb-j/chowchow),
similar to [api-formatter](https://npmjs.org/package/api-formatter).

```ts
// An example endpoint
export async function showProduct({ req, sendData, sendFail }: Context) {
  if (!req.query.id) {
    sendFail([`Please provide an 'id'`])
  } else {
    let product = await findProduct(req.query.id)
    sendData(product)
  }
}
```

Here's how to configure it:

```ts
import { ChowChow, BaseContext } from '@robb_j/chowchow'
import {
  JsonEnvelopeModule,
  JsonEnvelopeConfig
} from '@robb_j/chowchow-json-envelope'

type Context = BaseContext & JsonEnvelopeConfig

// App entry point
;(async () => {
  let chow = ChowChow.create<Context>()

  // Add the module
  chow.use(new JsonEnvelopeModule({ handleErrors: true }))

  // Adds new methods to the context
  chow.applyRoutes((app, r) => {
    app.get('/', r(ctx => ctx.sendData({ msg: 'Hey!' })))
    app.get('/err', r(ctx => ctx.sendFail(['Something broke :S']), 418))
  })

  // Run chow
  await chow.start()
})()
```

## Features

- Adds a `sendData` & `sendFail` method to the context to send formatted responses
- Defaults `name` & `version` in the envelope from `package.json` values
  - Configure this by passing them to the constructor
- Optionally handle express errors by passing `handleErrors`
  - Any errors thrown from routes will be formatted in the envelope
  - See [Catching errors](#catching-errors) for more

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
    "msg": "Hey!"
  }
}
```

### Failure Response, HTTP 400

```json
{
  "meta": {
    "success": false,
    "messages": ["Something broke :S"],
    "name": "my-fancy-api",
    "version": "v1"
  },
  "data": null
}
```

## Catching errors

You can pass `handleErrors` to add a chowchow error handler which will catch errors
and send the error message to `sendFail`.

The error handler will look at what was throw to determine how to send back an error.

- It will see if the object is an iterator, looking for [Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator).
- It will look for a string directly
- It will use an `Error`'s message

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
