import { createStore, action, Action } from 'easy-peasy'

export interface ImageProps {
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
}

export interface StoreType {
  romPath: string
  offset: number
  palette: number
  image: ImageProps
  compressed: boolean

  setRomPath: Action<StoreType, string>
  setOffset: Action<StoreType, number>
  setPalette: Action<StoreType, number>
  setImage: Action<StoreType, ImageProps>
  setCompressed: Action<StoreType, boolean>
}

const initialState: StoreType = {
  romPath: '',
  offset: 0,
  palette: 0,
  image: {
    width: 1,
    height: 1,
    maxWidth: 256,
    maxHeight: 256
  },
  compressed: false,

  setRomPath: action((state, value) => {
    state.romPath = value
  }),
  setOffset: action((state, value) => {
    state.offset = value
  }),
  setPalette: action((state, value) => {
    state.palette = value
  }),
  setImage: action((state, value) => {
    state.image = value
  }),
  setCompressed: action((state, value) => {
    state.compressed = value
  })
}

const store = createStore(initialState)

export default store
