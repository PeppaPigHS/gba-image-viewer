import fs from 'fs'
import PNG from 'pngjs'

import readLZ77 from './lib/lz77'

const main = (props: any) => {
  const { romPath, offset, palette, image, compressed } = props

  if (romPath === '') return null
  let fd: number = fs.openSync(romPath, 'r')

  let paletteBytes: Buffer = new Buffer(32)
  fs.readSync(fd, paletteBytes, 0, 32, palette)

  let paletteArray: Array<any> = []

  for (let i = 0; i < 32; i += 2) {
    let gbaColor: number = paletteBytes[i] + (paletteBytes[i + 1] << 8)
    paletteArray.push({
      r: (gbaColor & 0x1f) << 3,
      g: ((gbaColor >> 5) & 0x1f) << 3,
      b: ((gbaColor >> 10) & 0x1f) << 3
    })
  }

  let rawImage: Buffer = null

  if (compressed) {
    rawImage = readLZ77(fd, offset)
    if (rawImage == null) return null
  } else {
    let imageLength: number = image.width * image.height * 32
    rawImage = new Buffer(imageLength)
    fs.readSync(fd, rawImage, 0, imageLength, offset)
  }

  let imageData: Array<any> = []

  for (let i = 0; i < rawImage.length; i++) {
    imageData.push(paletteArray[rawImage[i] & 0xf])
    imageData.push(paletteArray[(rawImage[i] >> 4) & 0xf])
  }

  while ((imageData.length / 64) % image.width != 0) --image.width

  image.height = imageData.length / (64 * image.width)

  let png = new PNG.PNG({
      width: image.width * 8,
      height: image.height * 8
    }),
    index = 0

  for (let l = 0; l < image.height; l++) {
    for (let k = 0; k < image.width; k++) {
      for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 8; i++) {
          const idx = (image.width * 8 * ((l << 3) + j) + ((k << 3) + i)) << 2
          png.data[idx] = imageData[index].r
          png.data[idx + 1] = imageData[index].g
          png.data[idx + 2] = imageData[index].b
          png.data[idx + 3] = 255

          ++index
        }
      }
    }
  }

  fs.closeSync(fd)
  return { width: image.width, height: image.height, data: PNG.PNG.sync.write(png) }
}

export default main
