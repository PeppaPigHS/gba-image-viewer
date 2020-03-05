import React from 'react'

import styled from 'styled-components'
import { Card } from 'antd'

import { Browse } from './Browse'
import { Configuration } from './Configuration'
import { Preview } from './Preview'

const CustomCard = styled(Card)`
  margin-bottom: 8px;
`

const Dashboard = () => {
  return (
    <>
      <CustomCard size="small" title="Open ROM" hoverable>
        <Browse />
      </CustomCard>
      <CustomCard size="small" title="Configuration" hoverable>
        <Configuration />
      </CustomCard>
      <CustomCard size="small" title="Preview" hoverable>
        <Preview />
      </CustomCard>
    </>
  )
}

export default Dashboard
