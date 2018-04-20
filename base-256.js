const BigNum = require('bignum')

const decode = buf => {
  var uint64 = new BigNum(0)
  if (buf.length > 0 && (buf[0]&0x80) != 0) {
    var byte = 0x00
    if (!!(buf[0]&0x40) != 0) {
      byte = 0xff
    }

    for (var i = 0; i < buf.length; i++) {
      var c = buf[i]
      c ^= byte

      if (i === 0) {
        c &= 0x7f
      }

      uint64 = new BigNum(uint64)

      if (uint64.shiftRight(56).gt(0)) {
        return
      }

      uint64 = uint64.shiftLeft(8).or(c)
    }

    if (uint64.shiftRight(63).gt(0)) {
      return
    }

    if (byte === 0xff) {
      return uint64.add(1).neg()
    }

    return uint64
  }

  return uint64
}

module.exports = {
  decode
}
