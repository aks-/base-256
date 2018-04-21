const decode = buf => {
  var num = 0
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

      if ((num >>> 24) > 0) {
        return 0
      }

      num = (num << 8) | c
    }

    if ((num >>> 31) > 0) {
      return 0
    }

    if (byte === 0xff) {
      num += 1
      return -num
    }

    return num
  }

  return num
}

const encode = (buf, num) => {
  if (!isEncodable(num)) {
    throw new TypeError('number should be between range -2147483648 to 2147483647.')
  }

  const buflen = buf.length
  var bufPointer = buflen - 1

  if (fitsInBase256(buflen, num)) {
    for (var i = buflen - 1; i >= 0; i--) {
      const byte = num & 0xFF
      buf[bufPointer--] = byte
      num >>= 8
    }

    buf[0] |= 0x80
  }
}

const isEncodable = num => {
  return (num <= 2147483647) && (num >= -2147483648)
}

const fitsInBase256 = (buflength, num) => {
  var binBits = (buflength -1) * 8
  return buflength >= 9 ||
    (
      (num >= (-1 << binBits)) &&
      (num < (1 << binBits))
    )
}

module.exports = {
  decode,
  encode
}
