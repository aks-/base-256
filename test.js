const assert = require('assert')
const { decode } = require('./base-256')

const testDecoder = () => {
  const inputOutputPairs = [["", 0],
    ["\x80", 0],
    ["\x80\x00", 0],
    ["\x80\x00\x00", 0],
    ["\xbf", (1 << 6) - 1],
    ["\xbf\xff", (1 << 14) - 1],
    ["\xbf\xff\xff", (1 << 22) - 1],
    ["\xff", -1],
    ["\xff\xff", -1],
    ["\xff\xff\xff", -1],
    ["\xc0", -1 * (1 << 6)],
    ["\xc0\x00", -1 * (1 << 14)],
    ["\xc0\x00\x00", -1 * (1 << 22)],
    ["\x87\x76\xa2\x22\xeb\x8a\x72\x61", "537795476381659745"],
    ["\x80\x00\x00\x00\x07\x76\xa2\x22\xeb\x8a\x72\x61", "537795476381659745"],
    ["\xf7\x76\xa2\x22\xeb\x8a\x72\x61", "-615126028225187231"],
    ["\xff\xff\xff\xff\xf7\x76\xa2\x22\xeb\x8a\x72\x61", "-615126028225187231"]]

  inputOutputPairs.forEach(pair => {
    const buf = new Buffer(pair[0], 'binary')
    const decodedBigNum = decode(buf)
    assert(decodedBigNum.toString(), pair[1])
  })
}

testDecoder()
