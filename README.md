# base-256

encode and decode base256 encoding  as gnu-tar does

```
npm install base-256
```

## Usage

``` js
const { encode, decode } = require('base-256')

const buf = new Buffer(12)
encode(buf, "537795476381659745") // you can also pass instance of BigNum like so encode(buf, <BigNum 537795476381659745>)
// buf here is <Buffer 80 00 00 00 07 76 a2 22 eb 8a 72 61>

const decodedValue = decode(buf)
// decodedValue is <BigNum 537795476381659745>
```

## API
`base256.encode(buffer, bignum)`
Pass a buffer and the number in string format or [BigNum](https://github.com/justmoon/node-bignum) instance that needs to be encoded. The number will be encoded into that buffer.

`base256.decode(buf)`
Decode a [BigNum](https://github.com/justmoon/node-bignum) instance from a buffer

## License

MIT
