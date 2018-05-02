const assert = require('assert')
const { encode, decode } = require('./base-256')

const testDecoder = () => {
  const inputOutputPairs = [["", 0],
    ["\x82\x32\x80", 0, 2],
    ["\x80\x00", 0],
    ["\x80\x00\x00", 0],
    ["\xbf", (1 << 6) - 1],
    ["\xbf\xff", (1 << 14) - 1],
    ["\xbb\xbf\xff\xff", (1 << 22) - 1, 1],
    ["\xff", -1],
    ["\xff\xff", -1],
    ["\xff\xff\xff", -1],
    ["\xc0", -1 * (1 << 6)],
    ["\xc0\x00", -1 * (1 << 14)],
    ["\xc0\x00\x00", -1 * (1 << 22)],
    ["\x80\x7f\xff\xff\xff", 2147483647],
    ["\x11\x11\x11\x11\x11\x11\x80\x00\x00\x00\x00\x7f\xff\xff\xff", 2147483647, 6],
    ["\xff\x80\x00\x00\x00", -2147483648],
    ["\xff\xff\xff\xff\x80\x00\x00\x00", -2147483648],
    ["\x80\x00\x00\x1f\xff\xff\xff\xff\xfe\xff", Number.MAX_SAFE_INTEGER - Math.pow(2, 8)],
    ["\xff\xff\xff\xe0\x00\x00\x00\x00\x01\x01", -1 * (Number.MAX_SAFE_INTEGER - Math.pow(2, 8))]]

  inputOutputPairs.forEach(pair => {
    const buf = new Buffer(pair[0], 'binary')
    const offset = pair[2]
    const decodedBigNum = decode(buf, offset)
    assert.equal(decodedBigNum, pair[1])
  })
}

const testEncoder = () => {
  const inputOutputPairs = [[-1, "\xff"],
    [-1, "\xff\xff"],
    [-1, "\xff\xff\xff"],
    [(1 << 0), "0"],
    [(1 << 8) - 1, "\x80\xff"],
    [(1 << 8), "0\x00"],
    [(1 << 16) - 1, "\x80\xff\xff"],
    [(1 << 16), "00\x00"],
    [-1 * (1 << 0), "\xff"],
    [-1*(1<<0) - 1, "0"],
    [-1 * (1 << 8), "\xff\x00"],
    [-1*(1<<8) - 1, "0\x00"],
    [-1 * (1 << 16), "\xff\x00\x00"],
    [-1*(1<<16) - 1, "00\x00"],
    [2147483647, "\x80\x7f\xff\xff\xff"],
    [2147483647, "\x80\x00\x00\x00\x00\x7f\xff\xff\xff"],
    [-2147483648, "\xff\x80\x00\x00\x00"],
    [-2147483648, "\xff\xff\xff\xff\x80\x00\x00\x00"],
    [Number.MAX_SAFE_INTEGER - Math.pow(2, 8), "\x80\x00\x00\x1f\xff\xff\xff\xff\xfe\xff"],
    [-1 * (Number.MAX_SAFE_INTEGER - Math.pow(2, 8)), "\xff\xff\xff\xe0\x00\x00\x00\x00\x01\x01"]]

  inputOutputPairs.forEach(pair => {
    const tempbuf = new Buffer(pair[1], 'binary')
    const buf = new Buffer(tempbuf.length)
    tempbuf.copy(buf)
    encode(buf, pair[0])
    assert.ok(areBuffersEqual(buf, tempbuf))
  })
}

const testErrors = () => {
  testDecoderErrors()
  testEncoderErrors()
}

const testDecoderErrors = () => {
  [
    "\x80\x7f\xff\xff\xff\xff\xff\xff\xff",
    "\x80\x80\x00\x00\x00\x00\x00\x00\x00",
    "\xff\x80\x00\x00\x00\x00\x00\x00\x00",
    "\xff\x7f\xff\xff\xff\xff\xff\xff\xff",
    "\xf5\xec\xd1\xc7\x7e\x5f\x26\x48\x81\x9f\x8f\x9b"
  ].forEach(b => {
    const buf = new Buffer(b, 'binary')
    assert.throws(
      () => { decode(buf) },
      /^TypeError: Result out of range.$/
    )
  })

  assert.throws(
    () => { decode({}) },
    /^TypeError: decode only accepts buffer.$/
  )
}

const testEncoderErrors = () => {
  const buf = new Buffer("\x80\x00\x00\x00\x00\x7f\xff\xff\xff", 'binary')
  assert.throws(
    () => { encode(buf, Number.MAX_SAFE_INTEGER) },
    /^TypeError: number should be between range -9007199254740991 to 9007199254740991.$/
  )

  assert.throws(
    () => { encode({}, 2147483648) },
    /^TypeError: encode expects first parameter to be buffer.$/
  )

  assert.throws(
    () => { encode(buf, {}) },
    /^TypeError: encode expects second parameter to be integer.$/
  )
}

const areBuffersEqual = (buf, buf2) => {
  if (buf.length !== buf2.length) return false 

  var isBuffer = true
  for (var i = 0; i < buf.length; i++) {
    if (buf[i] !== buf2[i]) isBuffer = false
  }

  return isBuffer
}

testDecoder()
testEncoder()
testErrors()
