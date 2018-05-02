# base-256

encode and decode base256 encoding  as gnu-tar does (supported range is -9007199254740991 to 9007199254740991).

```
npm install base-256
```

[![Build Status](https://travis-ci.org/aks-/base-256.svg?branch=master)](https://travis-ci.org/aks-/base-256)

## How it is different than buffer.writeInt32BE
It's a variable length encoding.

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

`base256.decode(buf, [offset])`
Decode a number from a buffer. If an offset is passed as the second argument the buf should be decoded at that byte offset. The byte offset defaults to 0.

## Errors
- Throws `TypeError` if the input yields a number that is out of range (-9007199254740991 to 9007199254740991).
- Throws `TypeError` if the input is of not correct type.
- Throws `TypeError` if the output of decoded value of encoded buffer goes out of range -9007199254740991 to 9007199254740735. 

## License

MIT
