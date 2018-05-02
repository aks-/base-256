const { leftShift, rightShift } = require('./shift-operators')

const decode = ( buf, offset = 0 ) => {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError('decode only accepts buffer.')
  }

  var num = 0
  if (buf.length > 0 && (buf[offset]&0x80) != 0) {
    var byte = 0x00
    if (!!(buf[0]&0x40) != 0) {
      byte = 0xff
    }

    for (var i = offset; i < buf.length; i++) {
      var c = buf[i]
      c ^= byte

      if (i === offset) {
        c &= 0x7f
      }

      num = (leftShift(num, 8)) | c
    }

    if (byte === 0xff) {
      throwIfOutOfRange(num)
      num += 1
      return -num
    }

    throwIfOutOfRange(num)
    return num
  }

  return num
}

const throwIfOutOfRange = n => {
  if (n < Number.MIN_SAFE_INTEGER || n > Number.MAX_SAFE_INTEGER) {
    throw new TypeError('Result out of range.')
  }
}

const encode = (buf, num) => {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError('encode expects first parameter to be buffer.')
  }

  num = Number(num)

  if (isNaN(num) || (!Number.isInteger(num))) {
    throw new TypeError('encode expects second parameter to be integer.')
  }

  if (!isEncodable(num)) {
    // throw new TypeError('number should be between range -2147483648 to 2147483647.')
  }

  const buflen = buf.length
  var bufPointer = buflen - 1

  if (fitsInBase256(buflen, num)) {
    for (var i = buflen - 1; i >= 0; i--) {
      const byte = num & 0xFF
      buf[bufPointer--] = byte
      num = rightShift(num, 8)
    }

    buf[0] |= 0x80
  }
}

const isEncodable = num => {
  return (num < Number.MIN_SAFE_INTEGER || num > Number.MAX_SAFE_INTEGER)
}

const fitsInBase256 = (buflength, num) => {
  var binBits = (buflength -1) * 8
  return buflength >= 9 ||
    (
      (num >= (leftShift(-1, binBits))) &&
      (num < (leftShift(1, binBits)))
    )
}

module.exports = {
  decode,
  encode
}
