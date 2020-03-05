import electron from 'electron'
import React from 'react'
import { useStoreState } from 'easy-peasy'

import styled from 'styled-components'
import { Input, Button } from 'antd'

import store from '../store/store'

const ipcRenderer = electron.ipcRenderer || false

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const CustomInput = styled(Input)`
  margin-right: 8px;
  width: 100%;
`

export const Browse = () => {
  const romPath = useStoreState(state => state.romPath)
  const setRomPath = store.getActions().setRomPath

  const onClick = () => {
    if (ipcRenderer) setRomPath(ipcRenderer.sendSync('open-rom'))
  }

  return (
    <Row>
      <CustomInput value={romPath} disabled />
      <Button onClick={onClick}>...</Button>
    </Row>
  )
}
