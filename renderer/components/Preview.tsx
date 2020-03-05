import electron from 'electron'
import React, { useEffect, useState } from 'react'
import { useStoreState } from 'easy-peasy'

import styled from 'styled-components'
import { Button, message } from 'antd'

import store, { ImageProps } from '../store/store'

const ipcRenderer = electron.ipcRenderer || false

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Scroll = styled.div`
  width: 100%;
  height: 384px;
  overflow: scroll;
`

const CustomButton = styled(Button)`
  width: 100%;
  margin-bottom: 8px;
`

export const Preview = () => {
  const [romPath, offset, palette, compressed] = useStoreState(state => [
    state.romPath,
    state.offset,
    state.palette,
    state.compressed
  ])
  const image: ImageProps = useStoreState(state => state.image)

  const setImage = store.getActions().setImage

  const [imageBuffer, setImageBuffer] = useState<Buffer>(null)

  useEffect(() => {
    if (ipcRenderer) {
      if (romPath === '') return
      const imageData = ipcRenderer.sendSync('process-image', {
        romPath,
        offset,
        palette,
        image,
        compressed
      })
      if (imageData == null) {
        setImageBuffer(null)
        return
      }
      if (image.width != imageData.width || image.height != imageData.height) {
        setImage({
          ...image,
          ...{ width: imageData.width, height: imageData.height }
        })
      }
      setImageBuffer(imageData.data)
    }
  }, [romPath, offset, palette, compressed, image])

  const onClick = () => {
    if(ipcRenderer) {
      const msg = ipcRenderer.sendSync('save-image', imageBuffer)
      if(msg.success) message.success(msg.message)
      else message.error(msg.message)
    }
  }

  return (
    <Col>
      <CustomButton type="primary" onClick={onClick}>Save Image</CustomButton>
      <Scroll>
      {imageBuffer != null ? (
        <img
          src={`data:image/png;base64,${imageBuffer.toString('base64')}`}
          width={image.width * 8}
          height={image.height * 8}
        />
      ) : null}
      </Scroll>
    </Col>
  )
}
