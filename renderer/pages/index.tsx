import React from 'react'
import Head from 'next/head'

import 'antd/dist/antd.css'

import styled from 'styled-components'
import { Layout } from 'antd'

import { StoreProvider } from 'easy-peasy'
import store from '../store/store'

import Dashboard from '../components/Dashboard'

const { Header, Content, Footer } = Layout

const CustomLayout = styled(Layout)`
  min-height: 100vh;
`

const CustomHeader = styled(Header)`
  position: fixed;
  display: flex;
  flex-direction: row;
  z-index: 100;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  background: #1890ff;
`

const CustomContent = styled(Content)`
  padding: 16px 16px 0 16px;
  margin-top: 64px;
`

const Home = () => {
  return (
    <React.Fragment>
      <Head>
        <title>GBA Image Viewer @PeppaPigHS</title>
      </Head>
      <CustomLayout>
        <CustomHeader>
          <img src="/static/pokeball.png" style={{ margin: '8px 8px 0 0' }} width={48} height={48} />
          <h1 style={{ color: 'white' }}>GBA Image Viewer</h1>
        </CustomHeader>
        <CustomContent>
          <StoreProvider store={store}>
            <Dashboard />
          </StoreProvider>
        </CustomContent>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © 2019 PeppaPigHS
        </Footer>
      </CustomLayout>
    </React.Fragment>
  )
}

export default Home
