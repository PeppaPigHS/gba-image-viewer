import React from 'react'
import { useStoreState } from 'easy-peasy'

import { Input, Tooltip, Checkbox } from 'antd'

import store, { ImageProps } from '../store/store'

const addonWidth: string = '96px'

interface InputNumProps {
  title: string
  tooltip?: string
  space?: boolean
  value?: string
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomInput = (props: InputNumProps) => {
  return props.tooltip ? (
    <Tooltip title={props.tooltip} trigger="focus">
      <Input
        addonBefore={
          <div style={{ width: `${addonWidth}` }}>{props.title}</div>
        }
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        style={props.space ? { marginBottom: '8px' } : {}}
      />
    </Tooltip>
  ) : (
    <Input
      addonBefore={<div style={{ width: `${addonWidth}` }}>{props.title}</div>}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange}
      style={props.space ? { marginBottom: '8px' } : {}}
    />
  )
}

export const Configuration = () => {
  const image: ImageProps = useStoreState(state => state.image)
  const [offset, palette, compressed] = useStoreState(state => [
    state.offset,
    state.palette,
    state.compressed
  ])

  const setOffset = store.getActions().setOffset
  const setPalette = store.getActions().setPalette
  const setImage = store.getActions().setImage
  const setCompressed = store.getActions().setCompressed

  const changeOffset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^([0-9a-fA-F]+)$/.test(value)) setOffset(parseInt(value, 16))
    else if (value === '') setOffset(0)
  }

  const changePalette = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^([0-9a-fA-F]+)$/.test(value)) setPalette(parseInt(value, 16))
    else if (value === '') setPalette(0)
  }

  const changeWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width: number = parseInt(e.target.value)
    if (/^([0-9]+)$/.test(e.target.value)) {
      if (1 <= width && width <= image.maxWidth)
        setImage({
          ...image,
          ...{ width: width }
        })
      else if (width > image.maxWidth)
        setImage({
          ...image,
          ...{ width: image.maxWidth }
        })
      else
        setImage({
          ...image,
          ...{ width: 1 }
        })
    } else if (e.target.value === '') setImage({ ...image, ...{ width: 1 } })
  }

  const changeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height: number = parseInt(e.target.value)
    if (/^([0-9]+)$/.test(e.target.value)) {
      if (1 <= height && height <= image.maxHeight)
        setImage({
          ...image,
          ...{ height: height }
        })
      else if (height > image.maxHeight)
        setImage({
          ...image,
          ...{ height: image.maxHeight }
        })
      else
        setImage({
          ...image,
          ...{ height: 1 }
        })
    } else if (e.target.value === '') setImage({ ...image, ...{ height: 1 } })
  }

  const changeCompress = e => {
    setCompressed(e.target.checked)
  }

  return (
    <>
      <CustomInput
        title="Image Offset"
        value={offset.toString(16).toUpperCase()}
        onChange={changeOffset}
        tooltip="Image offset in hexadecimal format"
        space
      />
      <CustomInput
        title="Palette Offset"
        value={palette.toString(16).toUpperCase()}
        onChange={changePalette}
        tooltip="Palette offset in hexadecimal format"
        space
      />
      <CustomInput
        title="Image Width"
        value={image.width.toString()}
        onChange={changeWidth}
        tooltip="Image width in pixel divided by 8"
        space
      />
      <CustomInput
        title="Image Height"
        value={image.height.toString()}
        disabled={compressed}
        onChange={changeHeight}
        tooltip="Image height in pixel divided by 8"
        space
      />
      <Checkbox checked={compressed} onChange={changeCompress}>
        LZ77
      </Checkbox>
    </>
  )
}
