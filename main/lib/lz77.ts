import fs from 'fs'

const readLZ77 = (fd: number, offset: number) => {
  let data: Buffer = new Buffer(4)
  fs.readSync(fd, data, 0, 4, offset)

  if (data[0] == 0x10) {
    let dataLength: number = data[1] + (data[2] << 8) + (data[3] << 16)
    data = new Buffer(dataLength)

    offset += 4

    let watch: string = '',
      i: number = 0,
      pos: number = 8

    while (i < dataLength) {
      let currentOffset: number = offset
      if (pos != 8) {
        if (watch[pos] == '0') {
          fs.readSync(fd, data, i, 1, currentOffset)
          ++currentOffset
        } else {
          let r: Buffer = new Buffer(2)
          fs.readSync(fd, r, 0, 2, currentOffset)
          currentOffset += 2

          let length: number = r[0] >> 4
          let start: number = ((r[0] - ((r[0] >> 4) << 4)) << 8) + r[1]
          i = ammendArray(data, i, i - start - 1, length + 3)
          ++offset
        }
        ++offset
        ++i
        ++pos
      } else {
        let watchByte: Buffer = new Buffer(1)
        fs.readSync(fd, watchByte, 0, 1, currentOffset)
        ++currentOffset

        watch = watchByte[0].toString(2)
        while (watch.length != 8) watch = '0' + watch
        ++offset
        pos = 0
      }
    }

    return data
  } else return null
}

const ammendArray = (
  bytes: Buffer,
  index: number,
  start: number,
  length: number
) => {
  let a: number = 0,
    r: number = 0

  while (a != length) {
    if (index + r >= 0 && start + r >= 0 && index + a < bytes.length) {
      if (start + r >= index) {
        r = 0
        bytes[index + a] = bytes[start + r]
      } else bytes[index + a] = bytes[start + r]
    }
    ++a
    ++r
  }

  return (index += length - 1)
}

export default readLZ77
