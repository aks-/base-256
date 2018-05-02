const leftShift = (num, n) => {
  return Math.floor(
    num * Math.pow(2, n)
  )
}

const rightShift = (num, n) => {
  return Math.floor(
    num / Math.pow(2, n)
  )
}

module.exports = {
  leftShift,
  rightShift
}
