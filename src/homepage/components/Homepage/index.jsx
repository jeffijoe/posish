// @flow
import * as React from 'react'
import styled from 'emotion/react'
import { observer } from 'inferno-mobx'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import type { RootStore } from '../../../root-store'

const Container = styled('div')`
  padding: 20px;
  padding-top: 10%;
  max-width: 768px;
  margin: 0 auto;
`

const Title = styled('h1')`
  font-size: 2.6em;
  font-weight: 300;
  padding-bottom: 20px
`

const Content = styled('div')`
  font-size: 14px;
  padding-bottom: 20px;
  & p {
    padding-bottom: 10px;
    &:last-child {
      padding-bottom: 0;
    }
  }
`

export type Props = {
  rootStore: RootStore;
}

const Homepage = ({ rootStore }: Props) => {
  return (
    <Container>
      <Header rootStore={rootStore} />
      <Title>Posish</Title>
      <Content>
        <p>
          Posish is a tool that helps you generate code with character positions.
        </p>
        <p>Write or paste in some text, highlight areas of interest and generate some code.</p>
        <p>The primary use case for this is writing tests for parsers.</p>
      </Content>
      <Button to="/w/123">Let's go</Button>
    </Container>
  )
}

export default (observer(Homepage): typeof Homepage)
