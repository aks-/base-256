# base-256

encode and decode base256 encoding  as gnu-tar does (supported range is -2147483648 to 2147483647)

```
npm install base-256
```

## Usage

``` js
const { encode, decode } = require('base-256')

const buf = new Buffer(12)
encode(buf, 2147483647)
// buf here is <Buffer 80 7f ff ff ff

const decodedValue = decode(buf)
// decodedValue is 2147483647
```

## API
`base256.encode(buffer, num)`
Pass a buffer and the number that needs to be encoded. The number will be encoded into that buffer.

`base256.decode(buf)`
Decode a number from a buffer

## Errors
- Throws `TypeError` if the input yields a number that is out of range (-2147483648 to 2147483647).
- Throws `TypeError` if the input is of not correct type.

## License

MIT
